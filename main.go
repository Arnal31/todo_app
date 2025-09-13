package main

import (
	"embed"
	"log"
	"todo/app"
	app_config "todo/config/app"
	"todo/repository"
	"todo/service"
	database "todo/storage"
	"todo/utils"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Initialize configuratoin
	cfg := app_config.NewConfig()
	// Loads configuration from file or creates default one
	if err := cfg.Load(); err != nil {
		panic(err)
	}

	//Initialize local SQLite connection
	db, err := database.ConnectToLocalDB("sqlite3", cfg.LocalStorage.FilePath)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// Initialize PostgreSQL connection and repository safely
	var postgresRepo repository.TaskRepository
	var postgresService *service.Service
	// If there is an error connecting to PostgreSQL, use null repository
	if cfg.DB.IsValid() {
		postgresDB, err := database.ConnectToDB(utils.DsnFromParams(cfg.DB.Host, cfg.DB.Port, cfg.DB.User, cfg.DB.Password, cfg.DB.Name, cfg.DB.SSLMode))
		if err == nil {
			defer postgresDB.Close()
			postgresRepo = repository.NewPostgresTaskRepository(postgresDB)
			log.Println("Successfully connected to PostgreSQL database")
		} else {
			log.Printf("Failed to connect to PostgreSQL: %v, using null repository", err)
			postgresRepo = repository.NewNullTaskRepository()
		}
	} else {
		log.Println("PostgreSQL configuration invalid or empty, using null repository")
		postgresRepo = repository.NewNullTaskRepository()
	}

	postgresService = service.NewTaskService(postgresRepo)
	localRepo := repository.NewLocalTaskRepository(db)
	localService := service.NewTaskService(localRepo)

	// Create application instance
	app := app.NewApp(cfg, localService, postgresService)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "todo",
		Width:  cfg.Width,
		Height: cfg.Height,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.Startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
