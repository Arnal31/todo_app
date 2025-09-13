package storage

type PostgreConfig struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	Name     string `json:"name"`
	SSLMode  string `json:"ssl_mode"`
}

func NewPostgreConfig() PostgreConfig {
	return PostgreConfig{}
}

// checks if the postgres configuration has all required fields
func (p *PostgreConfig) IsValid() bool {
	return p.Host != "" && p.Port > 0 && p.User != "" && p.Name != "" && p.SSLMode != ""
}

// checks if the postgres configuration is completely empty
func (p *PostgreConfig) IsEmpty() bool {
	return p.Host == "" && p.Port == 0 && p.User == "" && p.Password == "" && p.Name == "" && p.SSLMode == ""
}
