package main

import (
	"github.com/JoaoMocho/image-moderator/backend/config"
	"github.com/JoaoMocho/image-moderator/backend/models"
	"github.com/JoaoMocho/image-moderator/backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	config.LoadEnvVariables()
	config.ConnectToDatabase()
}

func main() {
	config.DB.AutoMigrate(&models.Report{}, &models.Evaluation{})

	go models.ProcessAllNotEvaluatedReports()

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	routes.RegisterRoutes(r)

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true

	r.Use(cors.New(config))
	r.Run()
}
