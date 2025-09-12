package utils

import (
	"log"
	"strconv"
)

func DsnFromParams(host string, port int, username, password, dbName, sslMode string) string {
	log.Println("DsnFromParams called with:", host, port, username, dbName, sslMode)
	return "postgres://" + username + ":" + password + "@" + host + ":" +
		strconv.Itoa(port) + "/" + dbName + "?sslmode=" + sslMode
}
