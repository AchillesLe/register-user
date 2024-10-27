package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	kafka "github.com/segmentio/kafka-go"
)

type UserEvent struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
}

func logf(msg string, a ...interface{}) {
	fmt.Printf(msg, a...)
	fmt.Println()
}

func listenForUserEvents() {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:     []string{"kafka1:29092"},
		Topic:       "USER_REGISTRATION",
		GroupID:     "mail-service-group",
		Logger:      kafka.LoggerFunc(logf),
		ErrorLogger: kafka.LoggerFunc(logf),
	})
	defer reader.Close()

	for {
		msg, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("could not read message: %v\n", err)
			continue
		}
		var userEvent UserEvent
		if err := json.Unmarshal(msg.Value, &userEvent); err != nil {
			log.Printf("could not unmarshal message: %v\n", err)
			continue
		}

		log.Printf("Received user event: %+v\n", userEvent)
		sendEmail(userEvent)
	}
}

func sendEmail(user UserEvent) {
	log.Printf("Sending email to %s at %s...\n", user.Username, user.Email)
	// Ở đây có thể gọi API của bên thứ ba hoặc sử dụng thư viện gửi email.
	log.Printf("Email sent to user: %s\n", user.Email)
}

func main() {
	fmt.Println("Starting mail-service...")
	go listenForUserEvents()
	select {}
}
