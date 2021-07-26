import * as Db from '../../test/db'
import { Key, KeyDocument, KeyModel, KeySchema } from '../keys/keys.schema'
import { forKeysOwnerPipeline } from './devicesByKeys.query'

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
    expected: [{ address: 'device_1', keys: ['key_1'] }]
  },
  {
    toString: () => 'user_2',
    owner: 'user_2',
    expected: [
      { address: 'device_4', keys: ['key_5'] },
      { address: 'device_3', keys: ['key_4', 'key_3'] },
      { address: 'device_2', keys: ['key_2'] }
    ]
  },
  {
    toString: () => 'user_3',
    owner: 'user_3',
    expected: []
  }
]

describe('forKeysOwner query', () => {
  let db: Db.TestInstance
  let keyModel: KeyModel

  beforeAll(async () => {
    db = await Db.getInstance()

    await Db.insertTestData(db, testData)

    keyModel = db.connection.model<KeyDocument>(Key.name, KeySchema)
  })

  afterAll(async () => {
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ owner, expected }) => {
    const pipeline = forKeysOwnerPipeline(owner)

    const results = await keyModel.aggregate(pipeline)

    const ids = results.map((result) => ({
      address: result.address,
      keys: result.keys.map((key) => key.assetId)
    }))

    expect(ids).toEqual(expected)
  })
})
