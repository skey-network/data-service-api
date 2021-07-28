import * as Db from '../../test/db'
import {
  Device,
  DeviceDocument,
  DeviceModel,
  DeviceSchema
} from '../devices/devices.schema'
import { keysOwnerPipeline } from './devicesByKeys.query'

const testData: Db.TestCollection[] = [
  {
    collection: 'devices',
    objects: [
      { address: 'device_1' },
      { address: 'device_2' },
      { address: 'device_3' },
      { address: 'device_4' },
      { address: 'device_5' }
    ]
  },
  {
    collection: 'keys',
    objects: [
      { assetId: 'key_1', owner: 'user_1', device: 'device_1' },
      { assetId: 'key_2', owner: 'user_2', device: 'device_2' },
      { assetId: 'key_3', owner: 'user_2', device: 'device_3' },
      { assetId: 'key_4', owner: 'user_2', device: 'device_3' },
      { assetId: 'key_5', owner: 'user_2', device: 'device_4' }
    ]
  }
]

const cases = [
  {
    toString: () => 'user_1',
    owner: 'user_1',
    expected: ['device_1']
  },
  {
    toString: () => 'user_2',
    owner: 'user_2',
    expected: ['device_2', 'device_3', 'device_4']
  },
  {
    toString: () => 'user_3',
    owner: 'user_3',
    expected: []
  }
]

describe('forKeysOwner query', () => {
  let db: Db.TestInstance
  let deviceModel: DeviceModel

  beforeAll(async () => {
    db = await Db.getInstance()

    await Db.insertTestData(db.connection, testData)

    deviceModel = db.connection.model<DeviceDocument>(Device.name, DeviceSchema)
  })

  afterAll(async () => {
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ owner, expected }) => {
    const pipeline = keysOwnerPipeline(owner)

    const results = await deviceModel.aggregate(pipeline)

    const ids = results.map((doc) => doc.address)

    expect(ids).toEqual(expected)
  })
})
