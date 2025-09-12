package app

import (
	"context"
	"log"
	app_config "todo/config/app"
	"todo/service"
	database "todo/storage"
	"todo/utils"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	Config              *app_config.Config
	ctx                 context.Context
	DB                  *database.DB
	LocalStorageService service.TaskService
	PostgresService     service.TaskService
}

func NewApp(config *app_config.Config, s service.TaskService) *App {
	return &App{
		Config:              config,
		LocalStorageService: s,
	}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) ChangeTheme(newTheme string) error {
	a.Config.Theme = app_config.Theme(newTheme)
	return a.Config.SaveConfigToFile()
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

func (a *App) ConnectToDatabase(dbPayload DatabaseConnectionPayload) error {
	runtime.LogInfo(a.ctx, "Attempting to connect to database...")
	dsn := utils.DsnFromParams(string(dbPayload.Host), dbPayload.Port, dbPayload.Username, dbPayload.Password, dbPayload.DBName, dbPayload.SSLMode)
	var err error
	a.DB, err = database.ConnectToDB(dsn)
	if err != nil {
		log.Println("Error connecting to database:", err)
		return err
	}

	a.Config.DB.Host = dbPayload.Host
	a.Config.DB.Port = dbPayload.Port
	a.Config.DB.User = dbPayload.Username
	a.Config.DB.Password = dbPayload.Password
	a.Config.DB.Name = dbPayload.DBName
	a.Config.DB.SSLMode = dbPayload.SSLMode

	return a.Config.SaveConfigToFile()
}

type LocalStoragePayload struct {
	Title    string `json:"title"`
	Deadline string `json:"deadline"`
	Status   string `json:"status"`
	Priority string `json:"priority"`
}

func (a *App) SaveLocalTask(task LocalStoragePayload) error {
	log.Println("Saving task to local storage:", task)
	status := utils.GetStatusFromString(task.Status)
	return a.LocalStorageService.AddTask(task.Title, task.Deadline, status, task.Status)
}
