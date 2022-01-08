package productions

type ItemWithCount struct {
	Id    string  `json:"id" bson:"id"`
	Count float32 `json:"count" bson:"count"`
}

type KeyValue struct {
	Key   string  `json:"key" bson:"key"`
	Value float32 `json:"value" bson:"value"`
}

type Production struct {
	Id                 string          `json:"id" bson:"_id"`
	ItemId             string          `json:"itemId" bson:"itemId"`
	ProducedIn         []string        `json:"producedIn" bson:"producedIn"`
	Stack              float32         `json:"stack" bson:"stack"`
	ProducedPerDay     float32         `json:"producedPerDay" bson:"producedPerDay"`
	Seasons            []string        `json:"seasons" bson:"seasons"`
	DurabilityCost     *KeyValue       `json:"durabilityCost,omitempty" bson:"durabilityCost,omitempty"`
	OtherProducedItems []ItemWithCount `json:"otherProducedItems" bson:"otherProducedItems"`
	Costs              []ItemWithCount `json:"costs" bson:"costs"`
}

type ProductionList = []Production

type FromExcelProduction struct {
	ItemId             string   `json:"itemId"`
	BuildingIds        string   `json:"buildingIds"`
	Stack              float32  `json:"stack"`
	ProducedPerDay     float32  `json:"producedPerDay"`
	Seasons            *string  `json:"seasons,omitempty"`
	DurabilityCost     *string  `json:"durabilityCost"`
	OtherProducedItems *string  `json:"otherProducedItems"`
	Costs              []string `json:"costs"`
}

type FromExcelProductionList = []FromExcelProduction
