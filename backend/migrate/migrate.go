package main

import (
	"github.com/JoaoMocho/image-moderator/backend/config"
	"github.com/JoaoMocho/image-moderator/backend/models"
)

func init() {
	config.LoadEnvVariables()
	config.ConnectToDatabase()
}

func main() {
	config.DB.AutoMigrate(&models.Report{}, &models.Evaluation{})
}
