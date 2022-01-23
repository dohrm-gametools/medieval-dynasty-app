package games

import (
	"context"
	"fmt"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/buildings"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/items"
	"github.com/dohrm-gametools/medieval-dynasty-app/pkg/productions"
	"github.com/dohrm-gametools/medieval-dynasty-app/tools"
	"github.com/hashicorp/go-uuid"
	"github.com/thoas/go-funk"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"math"
)

type Services interface {
	Create(ctx context.Context) (*GameDetails, error)
	FindOne(id string, ctx context.Context) (*GameDetails, error)
	UpdateGameDetails(gameId string, payload PayloadUpdateGame, ctx context.Context) (*GameDetails, error)
	CreateOrUpdateWorker(gameId string, worker Worker, ctx context.Context) (*GameDetails, error)
	DeleteWorker(gameId string, workerId string, ctx context.Context) (*GameDetails, error)
	CreateOrUpdateBuilding(gameId string, building TownBuilding, ctx context.Context) (*GameDetails, error)
	DeleteBuilding(gameId string, buildingId string, ctx context.Context) (*GameDetails, error)
}

func NewServices(
	database *mongo.Database,
	buildingsServices buildings.Services,
	itemsServices items.Services,
	productionsServices productions.Services,
) Services {
	return &services{
		database:            database,
		buildingsServices:   buildingsServices,
		itemsServices:       itemsServices,
		productionsServices: productionsServices,
	}
}

type services struct {
	database            *mongo.Database
	buildingsServices   buildings.Services
	itemsServices       items.Services
	productionsServices productions.Services
}

func (s *services) save(details *GameDetails, ctx context.Context) (*GameDetails, error) {
	b, err := tools.AsBson(details)
	if err != nil {
		return nil, err
	}
	delete(b, "_id")
	result := s.database.Collection(Name).FindOneAndUpdate(
		ctx,
		bson.M{"_id": details.Id},
		bson.M{"$set": b, "$setOnInsert": bson.M{"_id": details.Id}},
		options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After),
	)
	if result.Err() != nil {
		return nil, result.Err()
	}
	doc := &GameDetails{}
	if err := result.Decode(doc); err != nil {
		return nil, err
	}
	return doc, nil
}

func (s *services) Create(ctx context.Context) (*GameDetails, error) {
	uid, err := uuid.GenerateUUID()
	if err != nil {
		return nil, err
	}
	return s.save(&GameDetails{Id: uid, Buildings: make([]*TownBuilding, 0), Workers: make([]Worker, 0)}, ctx)
}

func (s *services) FindOne(id string, ctx context.Context) (*GameDetails, error) {
	result := s.database.Collection(Name).FindOne(ctx, bson.M{"_id": id})
	if result.Err() != nil {
		return nil, result.Err()
	}
	res := &GameDetails{}
	if err := result.Decode(res); err != nil {
		return nil, err
	}
	return res, nil
}

func (s *services) UpdateGameDetails(gameId string, payload PayloadUpdateGame, ctx context.Context) (*GameDetails, error) {
	current, err := s.FindOne(gameId, ctx)
	if err != nil {
		return nil, err
	}

	update := map[string]map[string]interface{}{}

	if payload.Year != nil {
		inc := int(math.Max(float64(*payload.Year), 0)) - current.Year
		update["$inc"] = make(map[string]interface{})
		update["$inc"]["year"] = inc
		update["$inc"]["workers.$[].age"] = inc
	}

	if payload.Season != nil {
		update["$set"] = make(map[string]interface{})
		update["$set"]["season"] = *payload.Season
	}

	println(fmt.Sprintf("%v", update))

	result := s.database.
		Collection(Name).
		FindOneAndUpdate(ctx, bson.M{"_id": gameId, "workers.age": bson.M{"$gte": 0}}, update, options.FindOneAndUpdate().SetReturnDocument(options.After))
	if result.Err() != nil {
		println(result.Err().Error())
		return nil, err
	}
	res := &GameDetails{}
	if err := result.Decode(res); err != nil {
		return nil, err
	}
	return res, nil
}

func (s *services) CreateOrUpdateWorker(gameId string, worker Worker, ctx context.Context) (*GameDetails, error) {
	game, err := s.FindOne(gameId, ctx)
	if err != nil {
		return nil, err
	}
	if worker.Id == "" {
		uid, err := uuid.GenerateUUID()
		if err != nil {
			return nil, err
		}
		worker.Id = uid
	}
	widx := -1
	for idx, w := range game.Workers {
		if w.Id == worker.Id {
			widx = idx
			break
		}
	}
	if widx == -1 {
		game.Workers = append(game.Workers, worker)
	} else {
		game.Workers[widx] = worker
	}
	return s.save(game, ctx)
}

func (s *services) DeleteWorker(gameId string, workerId string, ctx context.Context) (*GameDetails, error) {
	game, err := s.FindOne(gameId, ctx)
	if err != nil {
		return nil, err
	}
	workers := make([]Worker, 0)
	for _, w := range game.Workers {
		if w.Id != workerId {
			workers = append(workers, w)
		}
	}
	game.Workers = workers
	for _, b := range game.Buildings {
		assigned := make([]string, 0)
		for _, w := range b.AssignedWorker {
			if w != workerId {
				assigned = append(assigned, w)
			}
		}
		b.AssignedWorker = assigned
	}
	return s.save(game, ctx)
}

func (s *services) CreateOrUpdateBuilding(gameId string, building TownBuilding, ctx context.Context) (*GameDetails, error) {
	game, err := s.FindOne(gameId, ctx)
	if err != nil {
		return nil, err
	}
	allBuildings, err := s.buildingsServices.FindAllTyped(ctx)
	if err != nil {
		return nil, err
	}
	allBuildingsByKey := make(map[string]buildings.Building)
	for _, b := range allBuildings {
		fmt.Printf("%s, %v\n", b.Id, b)
		allBuildingsByKey[b.Id] = b
	}
	fmt.Println(building.BuildingId)
	rawBuilding := allBuildingsByKey[building.BuildingId]

	allProductions, err := s.productionsServices.FindByBuildingTyped(building.BuildingId, ctx)
	if err != nil {
		return nil, err
	}
	allProductionByKeys := make(map[string]productions.Production)
	for _, p := range allProductions {
		allProductionByKeys[p.Id] = p
	}
	// Cleanup workers in function of the building capacity
	capa := 0
	fmt.Printf("%v\n", rawBuilding)
	if rawBuilding.Id != "" {
		if rawBuilding.Category == buildings.House {
			if rawBuilding.Capacity != nil {
				capa = *rawBuilding.Capacity
			}
		} else {
			if rawBuilding.Worker != nil {
				capa = *rawBuilding.Worker
			}
		}
	}
	if len(building.AssignedWorker) > capa {
		building.AssignedWorker = building.AssignedWorker[0:capa]
	}

	// Remove current worker from other buildings
	for _, worker := range building.AssignedWorker {
		for _, otherBuilding := range game.Buildings {
			otherRawBuilding := allBuildingsByKey[otherBuilding.BuildingId]
			if otherRawBuilding.Id != "" && rawBuilding.Id != "" {
				if otherRawBuilding.Category == buildings.House && rawBuilding.Category == buildings.House ||
					otherRawBuilding.Category != buildings.House && rawBuilding.Category != buildings.House {
					otherBuilding.AssignedWorker = funk.Filter(otherBuilding.AssignedWorker, func(w string) bool { return w != worker }).([]string)
				}
			}
		}
	}

	// Check productions
	building.Productions = funk.Filter(building.Productions, func(prod ProductionWithAssignment) bool {
		_, ok := allProductionByKeys[prod.ProductionId]
		return ok
	}).([]ProductionWithAssignment)
	// TODO Verify production rate
	// TODO Unicity on productions

	if building.Id == "" {
		uid, err := uuid.GenerateUUID()
		if err != nil {
			return nil, err
		}
		building.Id = uid
	}

	bidx := -1
	for idx, b := range game.Buildings {
		if b.Id == building.Id {
			bidx = idx
			break
		}
	}
	if bidx == -1 {
		game.Buildings = append(game.Buildings, &building)
	} else {
		game.Buildings[bidx] = &building
	}

	return s.save(game, ctx)
}

func (s *services) DeleteBuilding(gameId string, buildingId string, ctx context.Context) (*GameDetails, error) {
	game, err := s.FindOne(gameId, ctx)
	if err != nil {
		return nil, err
	}
	buildings := make([]*TownBuilding, 0)
	for _, b := range game.Buildings {
		if b.Id != buildingId {
			buildings = append(buildings, b)
		}
	}
	game.Buildings = buildings
	return s.save(game, ctx)
}
