package service

import (
	"time"
	"todo/models"
	"todo/repository"
)

type TaskService interface {
	AddTask(title string, deadline string, priority int, status string) error
	GetTasks() ([]models.Task, error)
	UpdateTask(id int, title string, deadline string, priority int, status string) error
	DeleteTask(id int) error
}

type Service struct {
	repository.TaskRepository
}

func NewTaskService(repo repository.TaskRepository) *Service {
	return &Service{
		TaskRepository: repo,
	}
}

func (s *Service) AddTask(title string, deadline string, priority int, status string) error {
	layout := "2006-01-02"

	t, err := time.Parse(layout, deadline)
	if err != nil {
		return err
	}

	_, err = s.TaskRepository.AddTask(&models.Task{
		Title:    title,
		Deadline: t,
		Priority: priority,
		Status:   status,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *Service) GetTasks() ([]models.Task, error) {
	tasks, err := s.TaskRepository.GetTasks()
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (s *Service) UpdateTask(id int, title string, deadline string, priority int, status string) error {
	layout := "2006-01-02"
	t, err := time.Parse(layout, deadline)
	if err != nil {
		return err
	}
	err = s.TaskRepository.UpdateTask(models.Task{
		ID:       id,
		Title:    title,
		Deadline: t,
		Priority: priority,
		Status:   status,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *Service) DeleteTask(id int) error {
	err := s.TaskRepository.DeleteTask(id)
	if err != nil {
		return err
	}
	return nil
}
