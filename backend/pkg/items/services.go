package items

import (
	"github.com/dohrm-gametools/medieval-dynasty-app/tools"
	"go.mongodb.org/mongo-driver/mongo"
)

type Services interface {
	tools.Crud
}

type services struct {
	*tools.MongoCRUD
}

func NewServices(database *mongo.Database) Services {
	return &services{
		MongoCRUD: tools.NewMongoCRUD(
			database,
			Name,
			func() interface{} { return &ItemList{} },
			func() interface{} { return &Item{} },
		),
	}
}
