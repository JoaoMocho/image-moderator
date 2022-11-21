package models

import (
	"errors"
	"time"

	"github.com/JoaoMocho/image-moderator/backend/config"
)

type Evaluation struct {
	ReportId      uint      `gorm:"primary_key" json:"report_id"`
	Report        Report    `gorm:"ForeignKey:ReportId" json:"-"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	NudityRaw     float64   `json:"nudity_raw"`
	NudityPartial float64   `json:"nudity_partial"`
	Weapon        float64   `json:"weapon"`
	Alcohol       float64   `json:"alcohol"`
	Drugs         float64   `json:"drugs"`
	Offensive     float64   `json:"offensive"`
	Gore          float64   `json:"gore"`
}

func (e *Evaluation) CreateEvaluation() (*Evaluation, error) {
	result := config.DB.Create(&e)
	if result.Error != nil {
		return nil, errors.New("could not create evaluation")
	}
	return e, nil
}

func GetEvaluationById(id uint) (*Evaluation, error) {
	var eval *Evaluation
	result := config.DB.Find(&eval, id)

	if result.Error != nil {
		return nil, errors.New("could not get evaluation by id")
	}

	return eval, nil
}
