package models

import "time"

type Task struct {
	ID       int       `json:"id"`
	Title    string    `json:"title"`
	Deadline time.Time `json:"deadline"`
	Priority int       `json:"priority"`
	Status   string    `json:"status"`
}
