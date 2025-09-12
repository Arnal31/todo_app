package database

import (
	"context"
	"log"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DB struct {
	*pgxpool.Pool
}

type DBs interface {
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	Exec(ctx context.Context, sql string, arguments ...any) (pgconn.CommandTag, error)
}

func ConnectToDB(dsn string) (*DB, error) {
	conn, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Println("Error connecting to database:", err)
		return nil, err
	}
	// Test the connection
	err = conn.Ping(context.Background())
	if err != nil {
		log.Println("Error pinging database:", err)
		return nil, err
	}
	return &DB{
		Pool: conn,
	}, nil
}

func (d *DB) Close() {
	d.Pool.Close()
}

func (d *DB) GetDB() *pgxpool.Pool {
	return d.Pool
}
