package config

import (
	"github.com/charmbracelet/log"

	"github.com/spf13/viper"
)

type Env struct {
	// server
	GoMode     string `mapstructure:"GO_MODE"`
	ServerHost string `mapstructure:"SERVER_HOST"`
	ServerPort uint16 `mapstructure:"SERVER_PORT"`
	// database
	DBHost         string `mapstructure:"DB_HOST"`
	DBName         string `mapstructure:"DB_NAME"`
	DBPort         uint16 `mapstructure:"DB_PORT"`
	DBUser         string `mapstructure:"DB_USER"`
	DBUserPwd      string `mapstructure:"DB_USER_PWD"`
	DBMinPoolSize  uint16 `mapstructure:"DB_MIN_POOL_SIZE"`
	DBMaxPoolSize  uint16 `mapstructure:"DB_MAX_POOL_SIZE"`
	DBQueryTimeout uint16 `mapstructure:"DB_QUERY_TIMEOUT_SEC"`
}

func NewEnv(filename string, override bool) *Env {
	viper.SetConfigFile(filename)

	if override {
		viper.AutomaticEnv()
	}

	err := viper.ReadInConfig()
	if err != nil {
		log.Error("Error reading environment file", "err", err)
	}

	env := Env{
		GoMode:         viper.GetString("GO_MODE"),
		ServerHost:     viper.GetString("SERVER_HOST"),
		ServerPort:     viper.GetUint16("SERVER_PORT"),
		DBHost:         viper.GetString("DB_HOST"),
		DBName:         viper.GetString("DB_NAME"),
		DBPort:         viper.GetUint16("DB_PORT"),
		DBUser:         viper.GetString("DB_USER"),
		DBUserPwd:      viper.GetString("DB_USER_PWD"),
		DBMinPoolSize:  viper.GetUint16("DB_MIN_POOL_SIZE"),
		DBMaxPoolSize:  viper.GetUint16("DB_MAX_POOL_SIZE"),
		DBQueryTimeout: viper.GetUint16("DB_QUERY_TIMEOUT_SEC"),
	}

	return &env
}
