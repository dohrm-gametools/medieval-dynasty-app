package pkg

import (
	"context"
	"fmt"
	"github.com/dohrm-gametools/medieval-dynasty-app/config"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/buildings"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/games"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/i18n"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/items"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/productions"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/x/mongo/driver/connstring"
	"net/http"
	"strings"
	"time"
)

func initMongodb() (*mongo.Database, func(), error) {
	cstring, err := connstring.Parse(config.MongoUri())
	if err != nil {
		return nil, nil, err
	}
	muri := options.Client().ApplyURI(cstring.String())
	mongoClient, err := mongo.NewClient(muri)
	if err != nil {
		return nil, nil, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = mongoClient.Connect(ctx)
	if err != nil {
		return nil, nil, err
	}
	database := mongoClient.Database(cstring.Database)
	return database, func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		_ = mongoClient.Disconnect(ctx)
	}, nil
}

func parseMongoError(err error, c *gin.Context) {
	if err == mongo.ErrNoDocuments {
		c.JSON(404, gin.H{"status": "not-found"})
	} else {
		c.JSON(500, gin.H{"status": "internal-server-error", "error": err.Error()})
	}
}

func serveSpa(prefix string) gin.HandlerFunc {
	directory := static.LocalFile(config.SpaDir(), true)
	fileserver := http.FileServer(directory)
	if prefix != "" {
		fileserver = http.StripPrefix(prefix, fileserver)
	}
	return func(c *gin.Context) {
		if directory.Exists(prefix, c.Request.URL.Path) {
			fileserver.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		} else {
			c.Request.URL.Path = "/"
			fileserver.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		}
	}
}

func Start() error {
	database, closeDatabase, err := initMongodb()
	if err != nil {
		return err
	}
	defer closeDatabase()
	// TODO Read config
	gin.SetMode(gin.ReleaseMode)

	accounts := gin.Accounts{}
	for _, c := range config.Accounts() {
		s := strings.Split(c, ":")
		if len(s) != 2 {
			continue
		}
		accounts[s[0]] = s[1]
	}

	r := gin.Default()

	r.GET("/@/metrics", gin.WrapH(promhttp.HandlerFor(prometheus.DefaultGatherer, promhttp.HandlerOpts{
		EnableOpenMetrics: true,
	})))

	ready := func(c *gin.Context) {
		timeout, cancelFunc := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancelFunc()
		err := database.Client().Ping(timeout, nil)
		if err == nil {
			c.JSON(200, gin.H{
				"status": "ok",
			})
		} else {
			c.JSON(500, gin.H{
				"status": "ko",
				"error":  err.Error(),
			})
		}
	}

	r.GET("/@/health", ready)
	r.GET("/@/ready", ready)

	authMiddleware := gin.BasicAuth(accounts)

	api := r.Group("/api", cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "OPTION"},
		AllowCredentials: true,
		AllowWildcard:    true,
		AllowHeaders:     []string{"Origin"},
	}))

	i18n.Routes(
		database,
		api.Group("/i18n"),
		parseMongoError,
		authMiddleware,
	)
	itemsServices := items.NewServices(database)
	buildingsServices := buildings.NewServices(database)
	productionServices := productions.NewServices(database)
	gameServices := games.NewServices(database, buildingsServices, itemsServices, productionServices)
	items.Routes(
		itemsServices,
		api.Group(fmt.Sprintf("/%s", items.Name)),
		parseMongoError,
		authMiddleware,
	)
	buildings.Routes(
		buildingsServices,
		api.Group(fmt.Sprintf("/%s", buildings.Name)),
		parseMongoError,
		authMiddleware,
	)
	productions.Routes(
		productionServices,
		api.Group(fmt.Sprintf("/%s", productions.Name)),
		parseMongoError,
		authMiddleware,
	)
	games.Routes(
		gameServices,
		api.Group(fmt.Sprintf("/%s", games.Name)),
		parseMongoError,
		authMiddleware,
	)

	r.Use(serveSpa("/"))

	return r.Run()
}
