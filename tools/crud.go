package tools

import "context"

type Crud interface {
	ListSupplier() interface{}
	OneSupplier() interface{}
	FindAll(ctx context.Context) (interface{}, error)
	FindById(id string, ctx context.Context) (interface{}, error)
	CreateOne(item interface{}, ctx context.Context) (interface{}, error)
	CreateBulk(items interface{}, ctx context.Context) (int64, error)
	Update(id string, item interface{}, ctx context.Context) (interface{}, error)
	Delete(id string, ctx context.Context) error
}
