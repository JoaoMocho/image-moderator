package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/JoaoMocho/image-moderator/backend/models"
	"github.com/JoaoMocho/image-moderator/backend/utils"
	"github.com/gin-gonic/gin"
)

func CreateReport(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	var (
		dst             string
		timeNowUnixNano int64 = time.Now().UnixNano()
		ext             string
	)

	// Get data from multipart-form

	// user_id
	userId := c.PostForm("user_id")
	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "\"user_id\" is missing."})
		return
	}

	// callback_url
	callbackUrl := c.PostForm("callback_url")
	if callbackUrl == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "\"callback_url\" is missing."})
		return
	}

	// image or image_url
	file, err := c.FormFile("image")
	if err == nil {
		// Check image ext
		ext = filepath.Ext(file.Filename)

		if ext != ".png" && ext != ".jpg" && ext != ".jpeg" {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "the provided file format is not allowed",
			})
			return
		}

		err = os.MkdirAll("assets/uploads", os.ModePerm)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "failed to create uploads folder",
			})
			return
		}

		// Upload the file to specific dst
		dst = fmt.Sprintf("assets/uploads/%d%s", timeNowUnixNano, ext)
		err = c.SaveUploadedFile(file, dst)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "failed to upload image",
			})
			return
		}

	} else {
		url := c.PostForm("image_url")
		if url == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "\"image\" and \"url\" are missing.",
			})
			return
		}

		// Check image_url ext
		ext = filepath.Ext(url)

		if ext != ".png" && ext != ".jpg" && ext != ".jpeg" {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "the provided file format is not allowed",
			})
			return
		}

		dst = fmt.Sprintf("assets/uploads/%d%s", timeNowUnixNano, ext)
		err = utils.DownloadImageFromUrl(url, dst)

		if err != nil {

			c.JSON(http.StatusBadRequest, gin.H{
				"message": "could not get image from url.",
			})
			return
		}

	}

	// Create report
	report := models.Report{UserId: userId, ImageUrl: dst, CallbackUrl: callbackUrl}

	newReport, err := report.CreateReport()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error creating report",
		})
		return
	}

	go models.ProcessReport(newReport)

	// Return response
	c.JSON(200, gin.H{
		"report": newReport,
	})
}

func GetReports(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	reports, err := models.GetReports()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error getting reports",
		})
		return
	}

	// Return response
	c.JSON(200, gin.H{
		"reports": reports,
	})
}

func GetAnsweredReports(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	reports, err := models.GetAnsweredReports()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error getting reports",
		})
		return
	}

	// Return response
	c.JSON(200, gin.H{
		"reports": reports,
	})
}

func UpdateReportAnswer(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	report_id, err := strconv.Atoi(c.Param("report_id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "report_id not valid"})
		return
	}

	var body struct {
		Approved bool
	}

	err = c.Bind(&body)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "approved must be a boolean"})
		return
	}

	rp, err := models.UpdateReportWithAnswer(uint(report_id), body.Approved)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error updating report",
		})
		return
	}

	err = utils.NotifyCallbackUrl(rp.CallbackUrl, body.Approved)

	if err != nil {
		c.JSON(200, gin.H{
			"report_id":         report_id,
			"updated":           true,
			"callback_notified": false,
		})
		return
	}

	// Return response
	c.JSON(200, gin.H{
		"report_id":         report_id,
		"updated":           true,
		"callback_notified": true,
	})
}
