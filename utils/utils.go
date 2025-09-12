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

func GetStatusFromString(status string) int {
	switch status {
	case "pending":
		return 1
	case "in-progress":
		return 2
	case "completed":
		return 3
	default:
		return 0
	}
}
