package tools

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"reflect"
)

type MongoCRUD struct {
	Database       *mongo.Database
	CollectionName string
	listSupplier   func() interface{}
	oneSupplier    func() interface{}
}

func NewMongoCRUD(database *mongo.Database, collectionName string, listSupplier func() interface{}, oneSupplier func() interface{}) *MongoCRUD {
	return &MongoCRUD{
		Database:       database,
		CollectionName: collectionName,
		listSupplier:   listSupplier,
		oneSupplier:    oneSupplier,
	}
}

func AsBson(item interface{}) (primitive.M, error) {
	data, err := bson.Marshal(item)
	if err != nil {
		return nil, err
	}
	doc := primitive.M{}

	err = bson.Unmarshal(data, &doc)
	return doc, err
}

func (s *MongoCRUD) ListSupplier() interface{} { return s.listSupplier() }
func (s *MongoCRUD) OneSupplier() interface{}  { return s.oneSupplier() }

func (s *MongoCRUD) FindAll(ctx context.Context) (interface{}, error) {
	cursor, err := s.Database.Collection(s.CollectionName).Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	result := s.ListSupplier()
	if err := cursor.All(ctx, result); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *MongoCRUD) FindById(id string, ctx context.Context) (interface{}, error) {
	result := s.Database.Collection(s.CollectionName).FindOne(ctx, bson.M{"_id": id})
	if result.Err() != nil {
		return nil, result.Err()
	}
	res := s.OneSupplier()
	if err := result.Decode(res); err != nil {
		return nil, err
	}
	return res, nil
}

func (s *MongoCRUD) CreateOne(item interface{}, ctx context.Context) (interface{}, error) {
	result, err := s.Database.Collection(s.CollectionName).InsertOne(ctx, item)
	if err != nil {
		return nil, err
	}
	res := s.OneSupplier()
	sr := s.Database.Collection(s.CollectionName).FindOne(ctx, bson.M{"_id": result.InsertedID})
	if sr.Err() != nil {
		return nil, sr.Err()
	}
	if err := sr.Decode(res); err != nil {
		return nil, err
	}
	return res, nil
}

func (s *MongoCRUD) CreateBulk(items interface{}, ctx context.Context) (int64, error) {
	models := make([]mongo.WriteModel, 0)
	asSlice := func(v reflect.Value) {
		for i := 0; i < v.Len(); i++ {
			doc, err := AsBson(v.Index(i).Interface())
			if err != nil {
				continue
			}
			models = append(models, mongo.NewInsertOneModel().SetDocument(doc))
		}
	}

	switch reflect.TypeOf(items).Kind() {
	case reflect.Ptr:
		v := reflect.ValueOf(items).Elem()
		if v.Kind() == reflect.Slice {
			asSlice(v)
		}
	case reflect.Slice:
		asSlice(reflect.ValueOf(items))
	}

	if len(models) == 0 {
		return 0, nil
	}
	result, err := s.Database.Collection(s.CollectionName).BulkWrite(ctx, models, options.BulkWrite().SetOrdered(false))
	if err != nil {
		return 0, err
	}
	return result.InsertedCount, nil
}

func (s *MongoCRUD) Update(id string, item interface{}, ctx context.Context) (interface{}, error) {
	b, err := AsBson(item)
	if err != nil {
		return nil, err
	}
	delete(b, "_id")

	result := s.Database.Collection(s.CollectionName).FindOneAndUpdate(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": b},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	)
	if result.Err() != nil {
		return nil, result.Err()
	}
	res := s.OneSupplier()
	if err := result.Decode(res); err != nil {
		return nil, err
	}
	return res, nil
}

func (s *MongoCRUD) Delete(id string, ctx context.Context) error {
	_, err := s.Database.Collection(s.CollectionName).DeleteOne(ctx, bson.M{"_id": id})
	return err
}
