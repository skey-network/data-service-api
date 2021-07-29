export interface Field {
  key: string
  weight: number
}

export interface IndexConfig {
  collection: string
  fields: Field[]
}

export const indexesConfigs: IndexConfig[] = [
  {
    collection: 'devices',
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
    fields: [
      { key: 'address', weight: 10 },
      { key: 'name', weight: 5 },
      { key: 'description', weight: 5 }
    ]
  },
  {
    collection: 'suppliers',
    fields: [
      { key: 'address', weight: 10 },
      { key: 'name', weight: 5 },
      { key: 'description', weight: 5 }
    ]
  }
]
