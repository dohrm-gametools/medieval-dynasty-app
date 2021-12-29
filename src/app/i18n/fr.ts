const fr = {
  lang: {
    en: 'Anglais',
    fr: 'Français',
  },
  root: {
    name: 'Medieval Dynasty',
    menu: {
      databases: {
        title: 'Données',
        items: {
          title: ''
        }
      }
    }
  },
  menu: {
    database: {
      title: 'Données',
      items: {
        title: 'Objets'
      },
      buildings: {
        title: 'Batiments'
      }
    },
    games: {
      title: 'Gestion des parties',
    },
    languages: {
      title: 'Langue',
      mapping: {
        en: 'gb',
        fr: 'fr',
      }
    }
  },
  buildings: {
    table: {
      headers: {
        category: 'Categorie',
        name: 'Nom',
        tax: 'Valeur de taxe',
        storage: 'Capacité de stockage',
        worker: 'Nombre de travailleurs',
      }
    },
    category: {
      House: 'Habitation',
      Extraction: 'Extraction',
      Hunting: 'Chasse',
      Farming: 'Ferme',
      AnimalHusbandry: 'Elevage',
      Production: 'Production',
      Service: 'Service',
      Storage: 'Stockage',
    },
  },
  items: {
    table: {
      headers: {
        category: 'Categorie',
        name: 'Nom',
        durability: 'Durabilité',
        weight: 'Poids',
        price: 'Prix',
      },
    },
    category: {
      clothes: 'Vêtements',
      consumable: 'Consommable',
      crafting: 'Artisanat',
      miscellaneous: 'Divers',
      tools: 'Outils',
    },
  },
  pagination: {
    pageSize: 'Nombre d\'éléments par page '
  },
}

export default fr;
