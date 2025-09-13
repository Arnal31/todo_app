package storage

import "os"

type SQLiteConfig struct {
	FilePath string `json:"file_path"`
}

// Returns the default SQLite configuraiton, creates necessary directories and files if they do not exist
func DefaultSQLiteConfig() SQLiteConfig {
	var defaultPath string
	dir, err := os.UserConfigDir()
	if err != nil {
		defaultPath = "."
	} else {
		defaultPath = dir
	}
	defaultPath = defaultPath + string(os.PathSeparator) + "todo_app"
	if _, err := os.Stat(defaultPath); os.IsNotExist(err) {
		os.MkdirAll(defaultPath, os.ModePerm)
	}
	defaultPath = defaultPath + string(os.PathSeparator) + "local.sqlite"

	if _, err := os.Stat(defaultPath); os.IsNotExist(err) {
		file, err := os.Create(defaultPath)
		if err == nil {
			file.Close()
		}
	}
	return SQLiteConfig{
		FilePath: defaultPath,
	}
}
