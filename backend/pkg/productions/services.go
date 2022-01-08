package productions

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"github.com/dohrm-gametools/medieval-dynasty-app/tools"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"strconv"
	"strings"
)

type Services interface {
	tools.Crud
	CreateBulkFromExcel(items []FromExcelProduction, ctx context.Context) (int64, error)
	FindByBuildingTyped(buildingId string, ctx context.Context) (ProductionList, error)
}

func NewServices(database *mongo.Database) Services {
	return &services{
		MongoCRUD: tools.NewMongoCRUD(
			database,
			Name,
			func() interface{} { return &ProductionList{} },
			func() interface{} { return &Production{} },
		),
	}
}

type services struct {
	*tools.MongoCRUD
}

func (s *services) CreateBulkFromExcel(items []FromExcelProduction, ctx context.Context) (int64, error) {
	toKeyValue := func(value *string) *KeyValue {
		if value == nil {
			return nil
		}
		s := strings.Split(*value, ":")
		if len(s) != 2 {
			return nil
		}
		v, err := strconv.ParseFloat(s[1], 32)
		if err != nil {
			return nil
		}
		return &KeyValue{Key: s[0], Value: float32(v)}
	}
	toStringArray := func(value *string) []string {
		if value == nil {
			return make([]string, 0)
		}
		return strings.Split(*value, ",")
	}
	toItemWithCounts := func(values []string) []ItemWithCount {
		result := make([]ItemWithCount, 0)
		for _, c := range values {
			kv := toKeyValue(&c)
			if kv == nil {
				continue
			}
			result = append(result, ItemWithCount{Id: kv.Key, Count: kv.Value})
		}
		return result
	}
	toInsert := ProductionList{}
	for _, item := range items {
		rawIds := append([]string{item.ItemId}, item.Costs...)
		if item.DurabilityCost != nil {
			rawIds = append(rawIds, *item.DurabilityCost)
		}
		hasher := sha1.New()
		hasher.Write([]byte(strings.Join(rawIds, "")))
		id := hex.EncodeToString(hasher.Sum(nil))
		var seasons = make([]string, 0)
		if item.Seasons != nil {
			seasons = strings.Split(*item.Seasons, ",")
		}

		toInsert = append(toInsert, Production{
			Id:                 id,
			ItemId:             item.ItemId,
			ProducedIn:         strings.Split(item.BuildingIds, ","),
			Stack:              item.Stack,
			ProducedPerDay:     item.ProducedPerDay,
			Seasons:            seasons,
			DurabilityCost:     toKeyValue(item.DurabilityCost),
			OtherProducedItems: toItemWithCounts(toStringArray(item.OtherProducedItems)),
			Costs:              toItemWithCounts(item.Costs),
		})
	}

	return s.CreateBulk(&toInsert, ctx)
}

func (s *services) FindByBuildingTyped(buildingId string, ctx context.Context) (ProductionList, error) {
	result, err := s.MongoCRUD.Database.Collection(Name).Find(ctx, bson.M{"producedIn": buildingId})
	if err != nil {
		return nil, err
	}
	res := ProductionList{}
	if err := result.All(ctx, &res); err != nil {
		return nil, err
	}
	return res, nil
}
