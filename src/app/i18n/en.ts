const en = {
  lang: {
    en: 'English',
    fr: 'French',
  },
  menu: {
    database: {
      title: 'Data',
      items: {
        title: 'Items'
      },
      buildings: {
        title: 'Buildings'
      }
    },
    games: {
      title: 'Game management',
    },
    languages: {
      title: 'Language',
      mapping: {
        en: 'gb',
        fr: 'fr',
      }
    }
  },
  buildings: {
    table: {
      headers: {
        category: 'Category',
        name: 'Name',
        tax: 'Tax value',
        storage: 'Storage capacity',
        worker: 'Worker number',
      }
    },
    category: {
      House: 'House',
      Extraction: 'Extraction',
      Hunting: 'Hunting',
      Farming: 'Farming',
      AnimalHusbandry: 'Animal husbandry',
      Production: 'Production',
      Service: 'Service',
      Storage: 'Storage',
    },
  },
  items: {
    table: {
      headers: {
        category: 'Category',
        name: 'Name',
        durability: 'Durability',
        weight: 'Weight',
        price: 'Price',
      },
    },
    pagination: {
      pageSize: 'Item per page '
    },
    category: {
      clothes: 'Clothes',
      consumable: 'Consumable',
      crafting: 'Crafting',
      miscellaneous: 'Miscellaneous',
      tools: 'Tools',
    },
  }
}

export default en;
