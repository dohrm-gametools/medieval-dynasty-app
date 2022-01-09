package i18n

import (
	"context"
	"fmt"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/buildings"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/items"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type Fetched struct {
	Id   string            `json:"id" bson:"_id"`
	I18n map[string]string `json:"i18n" bson:"i18n"`
}

type FetchedList = []Fetched

func fetchTranslations(database *mongo.Database, ctx context.Context) (map[string]map[string]string, error) {
	curs1, err := database.Collection(buildings.Name).Find(ctx, bson.M{}, options.Find().SetProjection(bson.M{"_id": 1, "i18n": 1}))
	if err != nil {
		return nil, err
	}
	defer func() { _ = curs1.Close(ctx) }()
	bds := make([]Fetched, 0)
	if err := curs1.All(ctx, &bds); err != nil {
		return nil, err
	}
	curs2, err := database.Collection(items.Name).Find(ctx, bson.M{}, options.Find().SetProjection(bson.M{"_id": 1, "i18n": 1}))
	if err != nil {
		return nil, err
	}
	defer func() { _ = curs2.Close(ctx) }()
	its := FetchedList{}
	if err := curs2.All(ctx, &its); err != nil {
		return nil, err
	}
	res := make(map[string]map[string]string)
	app := func(prefix string, items []Fetched) {
		for _, item := range items {
			for lang, trad := range item.I18n {
				if res[lang] == nil {
					res[lang] = make(map[string]string)
				}
				res[lang][fmt.Sprintf("%s.%s", prefix, item.Id)] = trad
			}
		}
	}
	app("db.buildings", bds)
	app("db.items", its)
	return res, nil
}

func Routes(database *mongo.Database, router *gin.RouterGroup, parseErrors func(err error, ctx *gin.Context), authMiddleware gin.HandlerFunc) {
	timeout := 5 * time.Second

	router.GET("/", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		translations, err := fetchTranslations(database, ctx)
		if err != nil {
			parseErrors(err, c)
			return
		}
		c.JSON(200, translations)
	})
}
