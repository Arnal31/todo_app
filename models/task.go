package models

type Task struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Deadline string `json:"deadline"`
	Priority int    `json:"priority"`
	Status   string `json:"status"`
	Created  string `json:"created_at"`
}
