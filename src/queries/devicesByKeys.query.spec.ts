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
      { address: 'device_5' },
      { address: 'device_6', removed: true },
      { address: 'device_7', removed: false }
    ]
  },
  {
    collection: 'keys',
    objects: [
      { assetId: 'key_1', owner: 'user_1', device: 'device_1' },
      { assetId: 'key_2', owner: 'user_2', device: 'device_2' },
      { assetId: 'key_3', owner: 'user_2', device: 'device_3' },
      { assetId: 'key_4', owner: 'user_2', device: 'device_3' },
      { assetId: 'key_5', owner: 'user_2', device: 'device_4' },
      { assetId: 'key_6', owner: 'user_3', device: 'device_5' },
      { assetId: 'key_7', owner: 'user_3', device: 'device_6' },
      { assetId: 'key_8', owner: 'user_3', device: 'device_7' }
    ]
  }
]

const cases = [
  {
    toString: () => 'One device',
    owner: 'user_1',
    includeRemoved: false,
    expected: ['device_1']
  },
  {
    toString: () => 'Multiple devices',
    owner: 'user_2',
    includeRemoved: false,
    expected: ['device_2', 'device_3', 'device_4']
  },
  {
    toString: () => 'No disabled devices',
    owner: 'user_3',
    includeRemoved: false,
    expected: ['device_5', 'device_7']
  },
  {
    toString: () => 'Includes disabled devices when queried with flag',
    owner: 'user_3',
    includeRemoved: true,
    expected: ['device_5', 'device_6', 'device_7']
  },
  {
    toString: () => 'No devices',
    owner: 'user_4',
    includeRemoved: false,
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

  it.each(cases)('%s', async ({ owner, expected, includeRemoved }) => {
    const pipeline = keysOwnerPipeline(owner, includeRemoved)

    const results = await deviceModel.aggregate(pipeline)

    const ids = results.map((doc) => doc.address)

    expect(ids).toEqual(expected)
  })
})
