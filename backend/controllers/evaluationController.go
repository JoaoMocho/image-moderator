package controllers

import (
	"net/http"
	"strconv"

	"github.com/JoaoMocho/image-moderator/backend/models"
	"github.com/gin-gonic/gin"
)

func GetEvaluationById(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "id not valid"})
		return
	}

	evaluation, err := models.GetEvaluationById(uint(id))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error getting evaluation by id",
		})
		return
	}

	// Return response
	c.JSON(200, gin.H{
		"evaluation": evaluation,
	})
}
