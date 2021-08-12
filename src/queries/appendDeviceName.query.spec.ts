import { GeoSearchInput } from '../devices/devices.args'
import * as Db from '../../test/db'
import { geoSearchPipeline } from './geoSearch.query'
import { appendDeviceName } from './appendDeviceName.query'

const devices: Db.TestCollection = {
  collection: 'devices',
  objects: [
    { address: 'dev_1', name: 'dev_1_name' },
    { address: 'dev_2', name: 'dev_2_name' },
    { address: 'dev_3' }
  ]
}

const keys: Db.TestCollection = {
  collection: 'keys',
  objects: [
    { assetId: 'key_1', device: 'dev_1' },
    { assetId: 'key_2', device: 'dev_2' },
    { assetId: 'key_3', device: 'dev_3' },
    { assetId: 'key_4', device: 'dev_4' },
    { assetId: 'key_5' }
  ]
}

const cases = [
  {
    toString: () => 'basic example',
    query: { assetId: 'key_1' },
    expected: [{ assetId: 'key_1', device: 'dev_1', deviceName: 'dev_1_name' }]
  },
  {
    toString: () => 'multiple keys && nullable values',
    query: {},
    expected: [
      { assetId: 'key_1', device: 'dev_1', deviceName: 'dev_1_name' },
      { assetId: 'key_2', device: 'dev_2', deviceName: 'dev_2_name' },
      { assetId: 'key_3', device: 'dev_3' },
      { assetId: 'key_4', device: 'dev_4' },
      { assetId: 'key_5' }
    ]
  }
]

describe('appendDeviceName query', () => {
  let db: Db.TestInstance

  beforeAll(async () => {
    db = await Db.getInstance()
    await Db.insertTestData(db.connection, [devices, keys])
  })

  afterAll(async () => {
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ query, expected }) => {
    const collection = db.connection.collection('keys')
    const pipeline = [...appendDeviceName(), { $match: query }]

    const results = await (
      await collection.aggregate(pipeline).toArray()
    ).map((obj) => {
      const { _id, ...rest } = obj
      return rest
    })

    expect(results).toEqual(expected)
  })
})
