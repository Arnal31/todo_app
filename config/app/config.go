package app_config

import (
	"encoding/json"
	"fmt"
	"os"
	"todo/config/storage"
	"todo/config/user"
)

type Theme string

var (
	Light Theme = "light"
	Dark  Theme = "dark"
)

type Config struct {
	User         user.UserInfo         `json:"user"`
	Height       int                   `json:"height"`
	Width        int                   `json:"width"`
	Theme        Theme                 `json:"theme"`
	DB           storage.PostgreConfig `json:"db"`
	LocalStorage storage.SQLiteConfig  `json:"local_storage"`
}

func NewConfig() *Config {
	return &Config{}
}

func (c *Config) Load() error {
	defaultPath := ""
	dir, err := os.UserConfigDir()
	if err != nil {
		defaultPath = "."
	} else {
		defaultPath = dir
	}

	defaultPath = defaultPath + string(os.PathSeparator) + "todo_app"

	if err := os.MkdirAll(defaultPath, 0755); err != nil {
		return fmt.Errorf("could not create config directory: %v", err)
	}

	configFilePath := defaultPath + string(os.PathSeparator) + "config.json"

	if _, err := os.Stat(configFilePath); os.IsNotExist(err) {
		c.LoadDefaults()
		if err := c.SaveConfigToFile(); err != nil {
			return fmt.Errorf("could not create default config file: %v", err)
		}
		return nil
	}

	configFile, err := os.ReadFile(configFilePath)
	if err != nil {
		return fmt.Errorf("could not open config file: %v", err)
	}

	err = json.Unmarshal(configFile, c)
	if err != nil {
		return fmt.Errorf("could not unmarshal config file: %v", err)
	}

	if c.LocalStorage.FilePath == "" {
		c.LocalStorage = storage.DefaultSQLiteConfig()
	}

	return nil
}

func (c *Config) LoadDefaults() {
	c.Height = 768
	c.Width = 1024
	c.Theme = Light
	c.LocalStorage = storage.DefaultSQLiteConfig()
	c.DB = storage.NewPostgreConfig()
}

func (c *Config) SaveConfigToFile() error {
	dir, err := os.UserConfigDir()
	if err != nil {
		dir = "."
	}

	configDir := dir + string(os.PathSeparator) + "todo_app"

	if err := os.MkdirAll(configDir, 0755); err != nil {
		return fmt.Errorf("could not create config directory: %v", err)
	}

	configPath := configDir + string(os.PathSeparator) + "config.json"

	configData, err := json.MarshalIndent(c, "", "  ")
	if err != nil {
		return fmt.Errorf("could not marshal config to JSON: %v", err)
	}

	if err := os.WriteFile(configPath, configData, 0644); err != nil {
		return fmt.Errorf("could not write config file: %v", err)
	}

	return nil
}
