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

func GetPriorityFromString(status string) int {
	switch status {
	case "Active":
		return 1
	case "Completed":
		return 2
	case "Expired":
		return 3
	default:
		return 0
	}
}

func GettingPriorityFromInt(status int) string {
	switch status {
	case 1:
		return "Active"
	case 2:
		return "Completed"
	case 3:
		return "Expired"
	default:
		return "unknown"
	}
}

func VerifyPayloadFields(name, password, host, sslMode string, port int) bool {
	if name == "" || password == "" || host == "" || sslMode == "" || port <= 0 {
		return false
	}
	return true
}
