package database

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
)

type LocalDB struct {
	*sql.DB
}

func ConnectToLocalDB(driverName, dataSourceName string) (*LocalDB, error) {
	db, err := sql.Open(driverName, dataSourceName)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return &LocalDB{DB: db}, nil
}

func (d *LocalDB) Close() error {
	err := d.DB.Close()
	return err
}
