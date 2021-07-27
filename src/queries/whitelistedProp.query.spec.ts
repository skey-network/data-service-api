import * as Db from '../../test/db'
import { whitelistedProp, WhitelistedPropInput } from './whitelistedProp.query'

const defaultKeysDevicesInput: WhitelistedPropInput = {
  localId: 'assetId',
  lookupCollection: 'devices',
  localField: 'device',
  foreignField: 'address',
  foreignArray: 'whitelist',
  newFieldName: 'whitelisted'
}

const defaultDevicesSuppliersInput: WhitelistedPropInput = {
  localId: 'address',
  lookupCollection: 'suppliers',
  localField: 'supplier',
  foreignField: 'address',
  foreignArray: 'whitelist',
  newFieldName: 'whitelisted'
}

const cases = [
  {
    toString: () => 'sets whitelisted to true in keys',
    testData: [
      {
        collection: 'devices',
        objects: [{ address: 'dev_1', whitelist: ['key_1'] }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', device: 'dev_1' }]
      }
    ],
    collectionName: 'keys',
    input: defaultKeysDevicesInput,
    expected: {
      key_1: true
    }
  },
  {
    toString: () => 'sets whitelisted to false in keys',
    testData: [
      {
        collection: 'devices',
        objects: [{ address: 'dev_1', whitelist: [] }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', device: 'dev_1' }]
      }
    ],
    collectionName: 'keys',
    input: defaultKeysDevicesInput,
    expected: {
      key_1: false
    }
  },
  {
    toString: () => 'sets whitelisted to true in devices',
    testData: [
      {
        collection: 'suppliers',
        objects: [{ address: 'sup_1', whitelist: ['dev_1'] }]
      },
      {
        collection: 'devices',
        objects: [{ address: 'dev_1', supplier: ['sup_1'] }]
      }
    ],
    collectionName: 'devices',
    input: defaultDevicesSuppliersInput,
    expected: {
      dev_1: true
    }
  },
  {
    toString: () => 'sets whitelisted to false in devices',
    testData: [
      {
        collection: 'suppliers',
        objects: [{ address: 'sup_1', whitelist: [] }]
      },
      {
        collection: 'devices',
        objects: [{ address: 'dev_1', supplier: ['sup_1'] }]
      }
    ],
    collectionName: 'devices',
    input: defaultDevicesSuppliersInput,
    expected: {
      dev_1: false
    }
  },
  {
    toString: () => 'undefined whitelist',
    testData: [
      {
        collection: 'devices',
        objects: [{ address: 'dev_1' }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', device: 'dev_1' }]
      }
    ],
    collectionName: 'keys',
    input: defaultKeysDevicesInput,
    expected: {
      key_1: false
    }
  },
  {
    toString: () => 'undefined local field',
    testData: [
      {
        collection: 'devices',
        objects: [{ address: 'dev_1', whitelist: ['key_1'] }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1' }]
      }
    ],
    collectionName: 'keys',
    input: defaultKeysDevicesInput,
    expected: {
      key_1: false
    }
  },
  {
    toString: () => 'undefined local id',
    testData: [
      {
        collection: 'devices',
        objects: [{ address: 'dev_1', whitelist: ['key_1'] }]
      },
      {
        collection: 'keys',
        objects: [{ device: 'dev_1' }]
      }
    ],
    collectionName: 'keys',
    input: defaultKeysDevicesInput,
    expected: {}
  },
  {
    toString: () => 'undefined foreign id',
    testData: [
      {
        collection: 'devices',
        objects: [{ whitelist: ['key_1'] }]
      },
      {
        collection: 'keys',
        objects: [{ assetId: 'key_1', device: 'dev_1' }]
      }
    ],
    collectionName: 'keys',
    input: defaultKeysDevicesInput,
    expected: {
      key_1: false
    }
  },
  {
    toString: () => 'multiple local items',
    testData: [
      {
        collection: 'devices',
        objects: [{ address: 'dev_1', whitelist: ['key_1', 'key_2', 'key_3'] }]
      },
      {
        collection: 'keys',
        objects: [
          { assetId: 'key_1', device: 'dev_1' },
          { assetId: 'key_2', device: 'dev_1' },
          { assetId: 'key_3', device: 'dev_1' },
          { assetId: 'key_4', device: 'dev_1' },
          { assetId: 'key_5', device: 'dev_1' }
        ]
      }
    ],
    collectionName: 'keys',
    input: defaultKeysDevicesInput,
    expected: {
      key_1: true,
      key_2: true,
      key_3: true,
      key_4: false,
      key_5: false
    }
  }
]

describe('whitelistedProp query', () => {
  let db: Db.TestInstance

  afterEach(async () => {
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ input, expected, testData, collectionName }) => {
    db = await Db.getInstance()
    await Db.insertTestData(db, testData)

    const collectionRef = db.connection.collection(collectionName)
    const pipeline = whitelistedProp(input)
    const results = await collectionRef.aggregate(pipeline).toArray()

    Object.entries(expected).forEach(([id, status]) => {
      const doc = results.find((result) => result[input.localId] === id)!

      expect(doc[input.newFieldName]).toBe(status)
    })
  })
})
