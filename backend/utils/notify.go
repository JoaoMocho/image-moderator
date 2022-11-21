package utils

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
)

func NotifyCallbackUrl(url string, answer bool) error {
	values := map[string]bool{"approved": answer}
	json_data, err := json.Marshal(values)

	if err != nil {
		return err
	}

	response, err := http.Post(url, "application/json", bytes.NewBuffer(json_data))
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		return errors.New("received non 200 response code")
	}

	content, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return err
	}

	fmt.Println("Notified Callback URL successfully. Response:", string(content))

	return nil
}
