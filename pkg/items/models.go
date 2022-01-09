package items

type Kind = string

const (
	Clothes       = Kind("clothes")
	Consumable    = Kind("consumable")
	Crafting      = Kind("crafting")
	Miscellaneous = Kind("miscellaneous")
	Tools         = Kind("tools")
)

type Item struct {
	Id                   string            `json:"id" bson:"_id"`
	Category             Kind              `json:"category" bson:"category"`
	Durability           float32           `json:"durability" bson:"durability"`
	Weight               float32           `json:"weight" bson:"weight"`
	Price                float32           `json:"price" bson:"price"`
	I18n                 map[string]string `json:"i18n" bson:"i18n"`
	Tool                 *string           `json:"tool,omitempty" bson:"tool,omitempty"`
	Damage               *float32          `json:"damage,omitempty" bson:"damage,omitempty"`
	Poisoning            *float32          `json:"poisoning,omitempty" bson:"poisoning,omitempty"`
	Extraction           *float32          `json:"extraction,omitempty" bson:"extraction,omitempty"`
	Heat                 *float32          `json:"heat,omitempty" bson:"heat,omitempty"`
	Cold                 *float32          `json:"cold,omitempty" bson:"cold,omitempty"`
	WeightLimit          *float32          `json:"weightLimit,omitempty" bson:"weightLimit,omitempty"`
	Health               *float32          `json:"health,omitempty" bson:"health,omitempty"`
	Stamina              *float32          `json:"stamina,omitempty" bson:"stamina,omitempty"`
	Food                 *float32          `json:"food,omitempty" bson:"food,omitempty"`
	Water                *float32          `json:"water,omitempty" bson:"water,omitempty"`
	Wood                 *float32          `json:"wood,omitempty" bson:"wood,omitempty"`
	Alcohol              *float32          `json:"alcohol,omitempty" bson:"alcohol,omitempty"`
	FoodConsumption      *float32          `json:"foodConsumption,omitempty" bson:"foodConsumption,omitempty"`
	StaminaConsumption   *float32          `json:"staminaConsumption,omitempty" bson:"staminaConsumption,omitempty"`
	WaterConsumption     *float32          `json:"waterConsumption,omitempty" bson:"waterConsumption,omitempty"`
	AdditionalHealth     *float32          `json:"additionalHealth,omitempty" bson:"additionalHealth,omitempty"`
	TemperatureTolerance *float32          `json:"temperatureTolerance,omitempty" bson:"temperatureTolerance,omitempty"`
	AdditionalDamage     *float32          `json:"additionalDamage,omitempty" bson:"additionalDamage,omitempty"`
	Duration             *float32          `json:"duration,omitempty" bson:"duration,omitempty"`
}

type ItemList = []Item
