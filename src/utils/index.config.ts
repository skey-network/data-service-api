export interface SearchField {
  key: string
  weight: number
}

export interface SearchIndexConfig {
  collection: string
  type: 'textSearch'
  fields: SearchField[]
}

export interface GeoSphereConfig {
  collection: string
  type: '2dsphere'
  fields: [string]
}

export type IndexConfig = SearchIndexConfig | GeoSphereConfig

export const indexesConfigs: IndexConfig[] = [
  {
    collection: 'devices',
    type: 'textSearch',
    fields: [
      { key: 'address', weight: 10 },
      { key: 'name', weight: 8 },
      { key: 'supplier', weight: 5 },
      { key: 'owner', weight: 5 },
      { key: 'description', weight: 5 },
      { key: 'details', weight: 3 },
      { key: 'custom', weight: 3 }
    ]
  },
  {
    collection: 'events',
    type: 'textSearch',
    fields: [
      { key: 'txHash', weight: 10 },
      { key: 'sender', weight: 5 },
      { key: 'device', weight: 5 },
      { key: 'assetId', weight: 5 },
      { key: 'action', weight: 3 }
    ]
  },
  {
    collection: 'keys',
    type: 'textSearch',
    fields: [
      { key: 'assetId', weight: 10 },
      { key: 'name', weight: 8 },
      { key: 'issuer', weight: 5 },
      { key: 'owner', weight: 5 },
      { key: 'device', weight: 5 }
    ]
  },
  {
    collection: 'organisations',
    type: 'textSearch',
    fields: [
      { key: 'address', weight: 10 },
      { key: 'name', weight: 5 },
      { key: 'description', weight: 3 }
    ]
  },
  {
    collection: 'suppliers',
    type: 'textSearch',
    fields: [
      { key: 'address', weight: 10 },
      { key: 'name', weight: 5 },
      { key: 'description', weight: 3 }
    ]
  },
  {
    collection: 'devices',
    type: '2dsphere',
    fields: ['location']
  }
]
