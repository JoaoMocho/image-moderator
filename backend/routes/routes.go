package routes

import (
	"net/http"

	"github.com/JoaoMocho/image-moderator/backend/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.MaxMultipartMemory = 10 << 20 // max 10 MB

	r.Static("/assets", "./assets")
	r.POST("/report/", controllers.CreateReport)
	r.GET("/report/", controllers.GetReports)
	r.GET("/report/answered/", controllers.GetAnsweredReports)
	r.PUT("/report/:report_id/answer/", controllers.UpdateReportAnswer)
	r.GET("/evaluation/:id", controllers.GetEvaluationById)

	// for testing callback url notification
	r.POST("/callback/", func(c *gin.Context) {
		var body struct {
			Approved bool
		}

		err := c.Bind(&body)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "approved must be a boolean"})
			return
		}

		var approvedString string
		if body.Approved {
			approvedString = "approved"
		} else {
			approvedString = "rejected"
		}

		// Return response
		c.JSON(200, gin.H{
			"message": "callback url was notified, the image report was " + approvedString,
		})
	})
}
