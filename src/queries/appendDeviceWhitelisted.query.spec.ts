import * as Db from '../../test/db'
import { appendDeviceWhitelisted } from './appendDeviceWhitelisted.query'

const cases = [
  {
    toString: () => 'basic example - positive',
    args: { filter: { deviceWhitelisted: true } },
    given: [
      {
        collection: 'suppliers',
        objects: [{ address: 'sup_1', whitelist: ['dev_1'] }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', issuer: 'sup_1', device: 'dev_1' }]
      }
    ],
    query: { assetId: 'key_1' },
    expected: [
      {
        assetId: 'key_1',
        issuer: 'sup_1',
        device: 'dev_1',
        deviceWhitelisted: true
      }
    ]
  },
  {
    toString: () => 'basic example - negative',
    args: { filter: { deviceWhitelisted: true } },
    given: [
      {
        collection: 'suppliers',
        objects: [{ address: 'sup_1', whitelist: [] }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', issuer: 'sup_1', device: 'dev_1' }]
      }
    ],
    query: { assetId: 'key_1' },
    expected: [
      {
        assetId: 'key_1',
        issuer: 'sup_1',
        device: 'dev_1',
        deviceWhitelisted: false
      }
    ]
  },
  {
    toString: () => 'missing supplier',
    args: { filter: { deviceWhitelisted: true } },
    given: [
      {
        collection: 'devices',
        objects: [{ address: 'dev_1' }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', issuer: 'sup_1', device: 'dev_1' }]
      }
    ],
    query: { assetId: 'key_1' },
    expected: [
      {
        assetId: 'key_1',
        issuer: 'sup_1',
        device: 'dev_1',
        deviceWhitelisted: false
      }
    ]
  },
  {
    toString: () => 'missing key',
    args: { filter: { deviceWhitelisted: true } },
    given: [
      {
        collection: 'suppliers',
        objects: [{ address: 'sup_1', whitelist: ['dev_1'] }]
      },
      {
        collection: 'devices',
        objects: [{ address: 'dev_1' }]
      }
    ],
    query: { assetId: 'key_1' },
    expected: []
  },
  {
    toString: () => 'multiple whitelisted items',
    args: { filter: { deviceWhitelisted: true } },
    given: [
      {
        collection: 'suppliers',
        objects: [
          { address: 'sup_1', whitelist: ['dev_1', 'dev_2'] },
          { address: 'sup_2', whitelist: ['dev_3'] }
        ]
      },
      {
        collection: 'keys',
        objects: [
          { assetId: 'key_1', issuer: 'sup_1', device: 'dev_1' },
          { assetId: 'key_2', issuer: 'sup_1', device: 'dev_2' },
          { assetId: 'key_3', issuer: 'sup_2', device: 'dev_3' }
        ]
      }
    ],
    query: {},
    expected: [
      {
        assetId: 'key_1',
        issuer: 'sup_1',
        device: 'dev_1',
        deviceWhitelisted: true
      },
      {
        assetId: 'key_2',
        issuer: 'sup_1',
        device: 'dev_2',
        deviceWhitelisted: true
      },
      {
        assetId: 'key_3',
        issuer: 'sup_2',
        device: 'dev_3',
        deviceWhitelisted: true
      }
    ]
  },
  {
    toString: () => 'nullable whitelist',
    args: { filter: { deviceWhitelisted: true } },
    given: [
      {
        collection: 'suppliers',
        objects: [{ address: 'sup_1' }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', issuer: 'sup_1', device: 'dev_1' }]
      }
    ],
    query: { assetId: 'key_1' },
    expected: [
      {
        assetId: 'key_1',
        issuer: 'sup_1',
        device: 'dev_1',
        deviceWhitelisted: false
      }
    ]
  },
  {
    toString: () => 'nullable issuer',
    args: { filter: { deviceWhitelisted: true } },
    given: [
      {
        collection: 'suppliers',
        objects: [{ address: 'sup_1', whitelist: ['dev_1'] }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', device: 'dev_1' }]
      }
    ],
    query: { assetId: 'key_1' },
    expected: [
      {
        assetId: 'key_1',
        device: 'dev_1',
        deviceWhitelisted: false
      }
    ]
  },
  {
    toString: () => 'nullable device',
    args: { filter: { deviceWhitelisted: false } },
    given: [
      {
        collection: 'suppliers',
        objects: [{ address: 'sup_1', whitelist: ['dev_1'] }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', issuer: 'sup_1' }]
      }
    ],
    query: { assetId: 'key_1' },
    expected: [
      {
        assetId: 'key_1',
        issuer: 'sup_1',
        deviceWhitelisted: false
      }
    ]
  },
  {
    toString: () => 'nullable filter value in args',
    args: { filter: { deviceWhitelisted: null } },
    given: [
      {
        collection: 'suppliers',
        objects: [{ address: 'sup_1', whitelist: ['dev_1'] }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', issuer: 'sup_1', device: 'dev_1' }]
      }
    ],
    query: { assetId: 'key_1' },
    expected: [
      {
        assetId: 'key_1',
        issuer: 'sup_1',
        device: 'dev_1'
      }
    ]
  }
]

describe('appendDeviceName query', () => {
  let db: Db.TestInstance

  beforeEach(async () => {
    db = await Db.getInstance()
  })

  afterEach(async () => {
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ given, args, query, expected }) => {
    await Db.insertTestData(db.connection, given)

    const collection = db.connection.collection('keys')
    const pipeline = [...appendDeviceWhitelisted(args as any), { $match: query }]

    const results = await (
      await collection.aggregate(pipeline).toArray()
    ).map((obj) => {
      const { _id, ...rest } = obj
      return rest
    })

    expect(results).toEqual(expected)
  })
})
