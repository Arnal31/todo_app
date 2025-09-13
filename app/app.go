package app

import (
	"context"
	"errors"
	"log"
	app_config "todo/config/app"
	"todo/repository"
	"todo/service"
	database "todo/storage"
	"todo/utils"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	Config              *app_config.Config
	ctx                 context.Context
	LocalStorageService service.TaskService
	PostgresService     service.TaskService
}

func NewApp(config *app_config.Config, s service.TaskService, ps service.TaskService) *App {
	return &App{
		Config:              config,
		LocalStorageService: s,
		PostgresService:     ps,
	}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) ChangeTheme(newTheme string) error {
	a.Config.Theme = app_config.Theme(newTheme)
	return a.Config.SaveConfigToFile()
}

func (a *App) GetTheme() string {
	return string(a.Config.Theme)
}

func (a *App) ChangeWindowSize(width int, height int) error {
	a.Config.Width = width
	a.Config.Height = height
	return a.Config.SaveConfigToFile()
}

type UserInfoPayload struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Username  string `json:"username"`
	Email     string `json:"email"`
}

func (a *App) GetUserInfo() UserInfoPayload {
	return UserInfoPayload{
		FirstName: a.Config.User.FirstName,
		LastName:  a.Config.User.LastName,
		Username:  a.Config.User.Username,
		Email:     a.Config.User.Email,
	}
}

func (a *App) UpdateUserInfo(userInfo UserInfoPayload) error {
	log.Println("Updating user info to:", userInfo)
	a.Config.User.Username = userInfo.Username
	a.Config.User.Email = userInfo.Email
	a.Config.User.FirstName = userInfo.FirstName
	a.Config.User.LastName = userInfo.LastName
	return a.Config.SaveConfigToFile()
}

func (a *App) Greet() string {
	return "Hello, World!"
}

type DatabaseConnectionPayload struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
	DBName   string `json:"dbName"`
	SSLMode  string `json:"sslMode"`
}

type PostgresStoragePayload struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Deadline string `json:"deadline"`
	Status   string `json:"status"`
	Priority string `json:"priority"`
	Created  string `json:"created_at"`
}

type PostgresConfigPayload struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
	DBName   string `json:"dbName"`
	SSLMode  string `json:"sslMode"`
}

func (a *App) GetPostgresConfig() PostgresConfigPayload {
	return PostgresConfigPayload{
		Host:     a.Config.DB.Host,
		Port:     a.Config.DB.Port,
		Username: a.Config.DB.User,
		Password: a.Config.DB.Password,
		DBName:   a.Config.DB.Name,
		SSLMode:  a.Config.DB.SSLMode,
	}
}

func (a *App) GetPostgresTasks() ([]PostgresStoragePayload, error) {
	log.Print("Fetching tasks from Postgres database")
	tasks, err := a.PostgresService.GetTasks()
	if err != nil {
		log.Println("Error fetching tasks from Postgres database:", err)
		return nil, err
	}
	log.Printf("Fetched %d tasks from Postgres database", len(tasks))
	var result []PostgresStoragePayload
	for _, t := range tasks {
		priority := utils.GettingPriorityFromInt(t.Priority)
		result = append(result, PostgresStoragePayload{
			ID:       t.ID,
			Title:    t.Title,
			Deadline: t.Deadline,
			Status:   t.Status,
			Priority: priority,
			Created:  t.Created,
		})
	}
	return result, nil
}

func (a *App) AddPostgresTask(task PostgresStoragePayload) (int, error) {
	log.Println("Adding task to Postgres dataabase:", task)
	prioirity := utils.GetPriorityFromString(task.Priority)
	id, err := a.PostgresService.AddTask(task.Title, task.Deadline, prioirity, task.Status, task.Created)
	if err != nil {
		log.Println("Error adding task to Postgres database:", err)
		return -1, err
	}
	return id, nil
}

func (a *App) UpdatePostgresTask(task PostgresStoragePayload) error {
	log.Println("Updating task in Postgres database:", task)
	priority := utils.GetPriorityFromString(task.Priority)
	err := a.PostgresService.UpdateTask(task.ID, task.Title, task.Deadline, priority, task.Status, task.Created)
	if err != nil {
		log.Println("Error updating task in Postgres database:", err)
	}
	return err
}

func (a *App) DeletePostgresTask(id int) error {
	log.Println("Deleting task from Postgres database with ID:", id)
	err := a.PostgresService.DeleteTask(id)
	if err != nil {
		log.Println("Error deleting task from Postgres database:", err)
	}
	return err
}

func (a *App) UpdatePostgresTaskStatus(id int, status string) error {
	err := a.PostgresService.UpdateTaskStatus(id, status)
	if err != nil {
		log.Println("Error updating task status in Postgres database:", err)
		return err
	}
	return nil
}

func (a *App) ConnectToDatabase(dbPayload DatabaseConnectionPayload) error {
	runtime.LogInfo(a.ctx, "Attempting to connect to database...")
	if !utils.VerifyPayloadFields(dbPayload.DBName, dbPayload.Password, dbPayload.Host, dbPayload.SSLMode, dbPayload.Port) {
		return errors.New("invalid database configuration: all fields are required")
	}
	dsn := utils.DsnFromParams(string(dbPayload.Host), dbPayload.Port, dbPayload.Username, dbPayload.Password, dbPayload.DBName, dbPayload.SSLMode)
	var err error
	db, err := database.ConnectToDB(dsn)
	if err != nil {
		log.Println("Database connection error:", err)
		return err
	}
	newRepo := repository.NewPostgresTaskRepository(db)
	a.PostgresService = service.NewTaskService(newRepo)
	runtime.LogInfo(a.ctx, "Successfully connected to the database.")

	a.Config.DB.Host = dbPayload.Host
	a.Config.DB.Port = dbPayload.Port
	a.Config.DB.User = dbPayload.Username
	a.Config.DB.Password = dbPayload.Password
	a.Config.DB.Name = dbPayload.DBName
	a.Config.DB.SSLMode = dbPayload.SSLMode

	return a.Config.SaveConfigToFile()
}

type LocalStoragePayload struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Deadline string `json:"deadline"`
	Status   string `json:"status"`
	Priority string `json:"priority"`
	Created  string `json:"created_at"`
}

func (a *App) SaveLocalTask(task LocalStoragePayload) (int, error) {
	log.Println("Saving task to local storage:", task)
	priority := utils.GetPriorityFromString(task.Status)
	return a.LocalStorageService.AddTask(task.Title, task.Deadline, priority, task.Status, task.Created)
}

func (a *App) GetLocalTasks() ([]LocalStoragePayload, error) {
	log.Print("Fetching tasks from local storage")
	tasks, err := a.LocalStorageService.GetTasks()
	if err != nil {
		log.Println("Error fetching tasks from local storage:", err)
		return nil, err
	}
	log.Printf("Fetched %d tasks from local storage", len(tasks))
	var result []LocalStoragePayload
	for _, t := range tasks {
		priority := utils.GettingPriorityFromInt(t.Priority)
		result = append(result, LocalStoragePayload{
			ID:       t.ID,
			Title:    t.Title,
			Deadline: t.Deadline,
			Status:   t.Status,
			Priority: priority,
			Created:  t.Created,
		})
	}
	return result, nil
}

func (a *App) DeleteLocalTask(id int) error {
	return a.LocalStorageService.DeleteTask(id)
}

func (a *App) UpdateLocalTask(task LocalStoragePayload) error {
	priority := utils.GetPriorityFromString(task.Status)
	return a.LocalStorageService.UpdateTask(task.ID, task.Title, task.Deadline, priority, task.Status, task.Created)
}

func (a *App) UpdateLocalTaskStatus(id int, status string) error {
	err := a.LocalStorageService.UpdateTaskStatus(id, status)
	if err != nil {
		log.Println("Error updating task status:", err)
	}
	return err
}
