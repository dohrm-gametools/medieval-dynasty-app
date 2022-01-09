package buildings

type Kind = string

const (
	House           = Kind("house")
	Extraction      = Kind("extraction")
	Hunting         = Kind("hunting")
	Farming         = Kind("farming")
	AnimalHusbandry = Kind("animal-husbandry")
	Production      = Kind("production")
	Service         = Kind("service")
	Storage         = Kind("storage")
)

type WorkerSkill = string

const (
	WSExtraction = WorkerSkill("extraction")
	WSHunting    = WorkerSkill("hunting")
	WSFarming    = WorkerSkill("farming")
	WSDiplomacy  = WorkerSkill("diplomacy")
	WSSurvival   = WorkerSkill("survival")
	WSCrafting   = WorkerSkill("crafting")
)

type Building struct {
	Id          string            `json:"id" bson:"_id"`
	Category    Kind              `json:"category" bson:"category"`
	Tax         float32           `json:"tax" bson:"tax"`
	I18n        map[string]string `json:"i18n" bson:"i18n"`
	WorkerSkill *WorkerSkill      `json:"workerSkill,omitempty" bson:"workerSkill,omitempty"`
	Storage     *float32          `json:"storage,omitempty" bson:"storage,omitempty"`
	Worker      *int              `json:"worker,omitempty" bson:"worker,omitempty"`
	Capacity    *int              `json:"capacity,omitempty" bson:"capacity,omitempty"`
}

type BuildingList = []Building
