package config

import (
	"github.com/spf13/viper"
	"strings"
)

func MongoUri() string   { return viper.GetString("MONGO_URI") }
func SpaDir() string     { return viper.GetString("SPA_DIR") }
func Accounts() []string { return strings.Split(viper.GetString("USERS"), ",") }
