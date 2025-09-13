package service

import (
	"log"
	"todo/models"
	"todo/repository"
)

// TaskService defines the interface for task-related business logic
type TaskService interface {
	AddTask(title string, deadline string, priority int, status string, created string) (int, error)
	GetTasks() ([]models.Task, error)
	UpdateTask(id int, title string, deadline string, priority int, status string, created string) error
	DeleteTask(id int) error
	UpdateTaskStatus(id int, status string) error
}

// Service struct implements TaskService interface
type Service struct {
	repository.TaskRepository
}

func NewTaskService(repo repository.TaskRepository) *Service {
	return &Service{
		TaskRepository: repo,
	}
}

func (s *Service) AddTask(title string, deadline string, priority int, status string, created string) (int, error) {
	t, err := s.TaskRepository.AddTask(&models.Task{
		Title:    title,
		Deadline: deadline,
		Priority: priority,
		Status:   status,
		Created:  created,
	})
	if err != nil {
		log.Println("Service: Error adding task:", err)
		return -1, err
	}
	return t.ID, nil
}

func (s *Service) GetTasks() ([]models.Task, error) {
	tasks, err := s.TaskRepository.GetTasks()
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (s *Service) UpdateTask(id int, title string, deadline string, priority int, status string, created string) error {
	err := s.TaskRepository.UpdateTask(models.Task{
		ID:       id,
		Title:    title,
		Deadline: deadline,
		Priority: priority,
		Status:   status,
		Created:  created,
	})
	if err != nil {
		return err
	}
	return nil
}

func (s *Service) DeleteTask(id int) error {
	err := s.TaskRepository.DeleteTask(id)
	if err != nil {
		log.Println("Error deleting task:", err)
		return err
	}
	return nil
}

func (s *Service) UpdateTaskStatus(id int, status string) error {
	err := s.TaskRepository.UpdateTaskStatus(id, status)
	if err != nil {
		return err
	}
	return nil
}
