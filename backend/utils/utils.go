package utils

import (
	"errors"
	"io/ioutil"
	"net/http"
	"os"
)

func DownloadImageFromUrl(url string, filePath string) (err error) {
	response, err := http.Get(url)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		return errors.New("received non 200 response code")
	}

	fb, err := ioutil.ReadAll(response.Body)
	if response.StatusCode != 200 {
		return errors.New("could not read file")
	}

	// Create a new file in the uploads directory
	dst, err := os.Create(filePath)
	if err != nil {
		return errors.New("could not create file")
	}

	defer dst.Close()

	// Copy the uploaded file to the filesystem
	// at the specified destination
	_, err = dst.Write(fb)
	if err != nil {
		return errors.New("could write file")
	}

	return nil
}

func FindMax(numbers []float64) float64 {
	max := numbers[0]
	for _, number := range numbers {
		if number > max {
			max = number
		}
	}
	return max
}
