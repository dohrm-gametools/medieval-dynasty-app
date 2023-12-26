package games

type ProductionWithAssignment struct {
	ProductionId    string  `json:"productionId" bson:"productionId"`
	ProductionValue float32 `json:"productionValue" bson:"productionValue"`
}

type TownBuilding struct {
	Id             string                     `json:"id" bson:"id"`
	BuildingId     string                     `json:"buildingId" bson:"buildingId"`
	Alias          *string                    `json:"alias,omitempty" bson:"alias,omitempty"`
	AssignedWorker []string                   `json:"assignedWorker" bson:"assignedWorker"`
	Productions    []ProductionWithAssignment `json:"productions" bson:"productions"`
}

type Sex = string

const (
	Male   = Sex("m")
	Female = Sex("f")
)

type Season = string

const (
	Spring = Season("spring")
	Summer = Season("summer")
	Autumn = Season("autumn")
	Winter = Season("winter")
)

type Skills struct {
	Extraction int `json:"extraction" bson:"extraction"`
	Hunting    int `json:"hunting" bson:"hunting"`
	Farming    int `json:"farming" bson:"farming"`
	Diplomacy  int `json:"diplomacy" bson:"diplomacy"`
	Survival   int `json:"survival" bson:"survival"`
	Crafting   int `json:"crafting" bson:"crafting"`
}

type Worker struct {
	Id     string `json:"id" bson:"id"`
	Name   string `json:"name" bson:"name"`
	Age    int    `json:"age" bson:"age"`
	Sex    Sex    `json:"sex" bson:"sex"`
	Skills Skills `json:"skills" bson:"skills"`
}

type GameDetails struct {
	Id        string          `json:"id" bson:"_id"`
	Year      int             `json:"year" bson:"year"`
	Season    Season          `json:"season" bson:"season"`
	Workers   []Worker        `json:"workers" bson:"workers"`
	Buildings []*TownBuilding `json:"buildings" bson:"buildings"`
}
