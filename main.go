package main

import (
	"embed"
	"todo/app"
	app_config "todo/config/app"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// TODO - Initialize application config, database, etc.
	cfg := app_config.NewConfig()

	if err := cfg.Load(); err != nil {
		panic(err)
	}
	// Create an instance of the app structure
	app := app.NewApp(cfg)

	// Create application with options
	err := wails.Run(&options.App{
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
