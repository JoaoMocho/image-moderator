package models

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/JoaoMocho/image-moderator/backend/config"
	"github.com/JoaoMocho/image-moderator/backend/utils"
)

type Report struct {
	Id              uint       `gorm:"primarykey" json:"id"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	UserId          string     `json:"user_id"`
	ImageUrl        string     `json:"image_url"`
	EvaluationScore *float64   `json:"evaluation_score"`
	Evaluated       bool       `json:"evaluated"`
	EvaluatedAt     *time.Time `json:"evaluated_at"`
	Answered        bool       `json:"answered"`
	AnsweredAt      *time.Time `json:"answered_at"`
	Approved        *bool      `json:"approved"`
	CallbackUrl     string     `json:"callback_url"`
}

func (rp *Report) CreateReport() (*Report, error) {
	result := config.DB.Create(&rp)

	if result.Error != nil {
		return nil, errors.New("could not create report")
	}

	return rp, nil
}

func GetReports() ([]*Report, error) {
	var rps []*Report
	result := config.DB.Where("answered = False").Order("evaluation_score desc").Find(&rps)

	if result.Error != nil {
		return nil, errors.New("could not get reports")
	}

	return rps, nil
}

func GetNonEvaluatedReports() ([]Report, error) {
	var Reports []Report

	result := config.DB.Model(&Report{}).Select("reports.id, reports.image_url").Joins("left join evaluations on reports.id = evaluations.report_id").Where("evaluations.report_id is NULL").Scan(&Reports)
	if result.Error != nil {
		return nil, errors.New("could not get non evaluated reports")
	}
	return Reports, nil
}

func GetAnsweredReports() ([]*Report, error) {
	var rps []*Report
	result := config.DB.Where("answered = True").Order("answered_at desc").Find(&rps)

	if result.Error != nil {
		return nil, errors.New("could not get answered reports")
	}

	return rps, nil
}

func UpdateReportWithEvaluationScore(id uint, score float64) error {
	timeNow := time.Now()
	result := config.DB.Where("id=?", id).Updates(Report{EvaluationScore: &score, Evaluated: true, EvaluatedAt: &timeNow})

	if result.Error != nil {
		return errors.New("could not report")
	}

	return nil
}

func UpdateReportWithAnswer(id uint, approved bool) (*Report, error) {
	timeNow := time.Now()
	var rp *Report

	result := config.DB.Where("id=?", id).Find(&rp).Updates(Report{Answered: true, AnsweredAt: &timeNow, Approved: &approved})

	if result.Error != nil {
		return nil, errors.New("could not update report")
	}

	return rp, nil
}

func ProcessAllNotEvaluatedReports() error {
	println("Getting non processed reports")

	nonEvaluatedReports, err := GetNonEvaluatedReports()

	if err != nil {
		return errors.New("error getting non evaluated reports")
	}

	fmt.Println("Found ", len(nonEvaluatedReports), " non evaluated reports!")

	for i, report := range nonEvaluatedReports {

		fmt.Println("Processing report number ", i+1, " with id = ", report.Id)

		err := ProcessReport(&report)
		if err != nil {
			fmt.Println(errors.New("error getting evaluation"), "report number ", i, " with id = ", report.Id)
		}
	}

	return nil
}

func ProcessReport(rp *Report) error {

	file, err := os.Open(rp.ImageUrl)
	if err != nil {
		return err
	}
	defer file.Close()

	body := &bytes.Buffer{}
	w := multipart.NewWriter(body)

	fw, err := w.CreateFormFile("media", filepath.Base(file.Name()))
	if err != nil {
		return err
	}
	_, err = io.Copy(fw, file)
	if err != nil {
		return err
	}

	fw, err = w.CreateFormField("api_user")
	if err != nil {
		return err
	}

	MediatorApiUser := os.Getenv("MEDIATOR_API_USER")
	if _, err = io.Copy(fw, strings.NewReader(MediatorApiUser)); err != nil {
		return err
	}

	fw, err = w.CreateFormField("api_secret")
	if err != nil {
		return err
	}

	MediatorApiSecret := os.Getenv("MEDIATOR_API_SECRET")
	if _, err = io.Copy(fw, strings.NewReader(MediatorApiSecret)); err != nil {
		return err
	}

	fw, err = w.CreateFormField("models")
	if err != nil {
		return err
	}

	MediatorModels := os.Getenv("MEDIATOR_MODELS")
	if _, err = io.Copy(fw, strings.NewReader(MediatorModels)); err != nil {
		return err
	}

	// Don't forget to close the multipart writer.
	// If you don't close it, your request will be missing the terminating boundary.
	w.Close()

	// Now that you have a form, you can submit it to your handler.
	MediatorUrl := os.Getenv("MEDIATOR_URL")
	req, err := http.NewRequest("POST", MediatorUrl, body)
	if err != nil {
		return err
	}
	// Don't forget to set the content type, this will contain the boundary.
	req.Header.Set("Content-Type", w.FormDataContentType())

	// Submit the request
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	// Check the response
	if res.StatusCode != http.StatusOK {
		fmt.Println("bad status: ", res.Status)
		return errors.New("unable to evaluate the image")
	}

	content, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	var result map[string]interface{}
	json.Unmarshal(content, &result)

	var (
		nudityRaw     float64 = result["nudity"].(map[string]interface{})["raw"].(float64)
		nudityPartial float64 = result["nudity"].(map[string]interface{})["partial"].(float64)
		weapon        float64 = result["weapon"].(float64)
		alcohol       float64 = result["alcohol"].(float64)
		drugs         float64 = result["drugs"].(float64)
		offensive     float64 = result["offensive"].(map[string]interface{})["prob"].(float64)
		gore          float64 = result["gore"].(map[string]interface{})["prob"].(float64)
	)

	eval := &Evaluation{ReportId: rp.Id, NudityRaw: nudityRaw, NudityPartial: nudityPartial, Weapon: weapon, Alcohol: alcohol, Drugs: drugs, Offensive: offensive, Gore: gore}

	_, err = eval.CreateEvaluation()
	if err != nil {
		return errors.New("unable to create evaluation")
	}

	score := utils.FindMax([]float64{nudityRaw, nudityPartial / 3, weapon, alcohol, drugs, offensive, gore})
	err = UpdateReportWithEvaluationScore(rp.Id, score)
	if err != nil {
		return errors.New("unable to update report")
	}

	fmt.Println("Image processed! ID:", rp.Id, "URL:", rp.ImageUrl)
	return nil
}
