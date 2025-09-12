package repository

import (
	"context"
	"log"
	"todo/models"
	database "todo/storage"
)

type TaskRepository interface {
	AddTask(task *models.Task) (*models.Task, error)
	GetTasks() ([]models.Task, error)
	UpdateTask(task models.Task) error
	DeleteTask(id int) error
	UpdateTaskStatus(id int, status string) error
}

type LocalTaskRepository struct {
	SQliteDB *database.LocalDB
}

type PostgresTaskRepository struct {
	PostgresDB database.DBs
}

func NewPostgresTaskRepository(db database.DBs) *PostgresTaskRepository {
	return &PostgresTaskRepository{
		PostgresDB: db,
	}
}

func (r *PostgresTaskRepository) AddTask(task *models.Task) (*models.Task, error) {
	var last_user_id int
	query := "INSERT INTO tasks(title, deadline, priority, status) VALUES ($1, $2, $3, $4) returning id"
	ctx := context.Background()
	row := r.PostgresDB.QueryRow(
		ctx,
		query,
		task.Title,
		task.Deadline,
		task.Priority,
		task.Status,
	)

	err := row.Scan(&last_user_id)
	if err != nil {
		return nil, err
	}
	task.ID = int(last_user_id)
	return task, nil
}

func (r *PostgresTaskRepository) GetTasks() ([]models.Task, error) {
	query := "SELECT id, title, deadline, priority, status FROM tasks"
	ctx := context.Background()
	rows, err := r.PostgresDB.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		err := rows.Scan(&task.ID, &task.Title, &task.Deadline,
			&task.Priority, &task.Status)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func (r *PostgresTaskRepository) UpdateTask(task models.Task) error {
	query := "UPDATE tasks SET title = $1, deadline = $2, priority = $3, status = $4 WHERE id = $5"
	ctx := context.Background()
	_, err := r.PostgresDB.Exec(ctx, query, task.Title, task.Deadline, task.Priority, task.Status, task.ID)
	return err
}

func (r *PostgresTaskRepository) DeleteTask(id int) error {
	query := "DELETE FROM tasks WHERE id = $1"
	ctx := context.Background()
	_, err := r.PostgresDB.Exec(ctx, query, id)
	return err
}

func NewLocalTaskRepository(db *database.LocalDB) *LocalTaskRepository {
	createTableSQL := `
		CREATE TABLE IF NOT EXISTS tasks (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT,
			deadline TEXT,
			priority TEXT,
			status TEXT
		);`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		panic(err)
	}
	return &LocalTaskRepository{
		SQliteDB: db,
	}
}

func (r *LocalTaskRepository) UpdateTask(task models.Task) error {
	query := "UPDATE tasks SET title = ?, deadline = ?, priority = ?, status = ? WHERE task.ID = ?"
	_, err := r.SQliteDB.Exec(query, task.Title, task.Deadline, task.Priority, task.Status, task.ID)
	return err
}

func (r *LocalTaskRepository) DeleteTask(id int) error {
	query := "DELETE FROM tasks WHERE id = ?"
	_, err := r.SQliteDB.Exec(query, id)
	return err
}

func (r *LocalTaskRepository) UpdateTaskStatus(id int, status string) error {
	query := "UPDATE tasks SET status = ? WHERE id = ?"
	_, err := r.SQliteDB.Exec(query, status, id)
	if err != nil {
		log.Println("Error updating task status:", err)
	}
	return err
}
func (r *LocalTaskRepository) GetTasks() ([]models.Task, error) {
	query := "SELECT id, title, deadline, priority, status FROM tasks"
	rows, err := r.SQliteDB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		err := rows.Scan(&task.ID, &task.Title, &task.Deadline, &task.Priority, &task.Status)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func (r *LocalTaskRepository) AddTask(task *models.Task) (*models.Task, error) {
	query := "INSERT INTO tasks (title, deadline, priority, status) VALUES (?, ?, ?, ?)"
	result, err := r.SQliteDB.DB.Exec(query, task.Title, task.Deadline, task.Priority, task.Status)
	if err != nil {
		return nil, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	task.ID = int(id)
	return task, nil
}
