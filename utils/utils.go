package utils

func DsnFromParams(host string, port int, username, password, dbName, sslMode string) string {
	return "postgres://" + username + ":" + password + "@" + host + ":" +
		string(rune(port)) + "/" + dbName + "?sslmode=" + sslMode
}
