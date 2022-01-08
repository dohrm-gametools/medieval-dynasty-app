package buildings

import (
	"context"
	"github.com/dohrm-gametools/medieval-dynasty-app/tools"
	"go.mongodb.org/mongo-driver/mongo"
)

type Services interface {
	tools.Crud
	FindAllTyped(ctx context.Context) (BuildingList, error)
}

type services struct {
	*tools.MongoCRUD
}

func NewServices(database *mongo.Database) Services {
	return &services{
		MongoCRUD: tools.NewMongoCRUD(
			database,
			Name,
			func() interface{} { return &BuildingList{} },
			func() interface{} { return &Building{} },
		),
	}
}

func (s *services) FindAllTyped(ctx context.Context) (BuildingList, error) {
	res, err := s.FindAll(ctx)
	if err != nil {
		return nil, err
	}
	return *(res.(*BuildingList)), nil
}
