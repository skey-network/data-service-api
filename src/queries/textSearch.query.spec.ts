import * as Db from '../../test/db'
import { IndexService } from '../utils/index.service'
import { IndexConfig } from '../utils/index.config'
import { textSearchPipeline } from './textSearch.query'
import { Logger } from '@nestjs/common'

const COLLECTION_NAME = 'items'

const indexConfig: IndexConfig = {
  collection: 'items',
  type: 'textSearch',
  fields: [
    { key: 'address', weight: 10 },
    { key: 'name', weight: 5 },
    { key: 'desc', weight: 2 }
  ]
}

const cases = [
  {
    toString: () => 'address first',
    data: [
      { address: 'ccc', desc: 'address aaa helper description' },
      { address: 'ddd', name: 'other' },
      { address: 'aaa' }
    ],
    input: 'aaa',
    expected: ['aaa', 'ccc']
  },
  {
    toString: () => 'items sorted by weight',
    data: [
      {
        address: 'bbb',
        name: 'stable',
        desc: 'horse stable, we like animals'
      },
      {
        address: 'aaa',
        name: 'horse and other stuff',
        desc: 'stable'
      }
    ],
    input: 'horse',
    expected: ['aaa', 'bbb']
  },
  {
    toString: () => 'items sorted by number of occurences',
    data: [
      {
        address: 'aaa',
        name: 'parrot'
      },
      {
        address: 'bbb',
        name: 'parrot parrot'
      },
      {
        address: 'ccc',
        name: 'parrot parrot parrot'
      }
    ],
    input: 'parrot',
    expected: ['ccc', 'bbb', 'aaa']
  },
  {
    toString: () => 'empty items',
    data: [{}, { address: 'aaa', name: 'other' }, { address: 'aaa' }],
    input: 'bear',
    expected: []
  },
  {
    toString: () => 'empty search',
    data: [{ address: 'aaa' }, { address: 'bbb' }],
    input: '',
    expected: ['aaa', 'bbb']
  }
]

describe('text search query', () => {
  let db: Db.TestInstance

  beforeAll(async () => {
    Logger.overrideLogger(false)
    db = await Db.getInstance()

    const service = new IndexService(db.connection)
    await service.handleIndexes([indexConfig])
  })

  afterAll(async () => {
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ input, expected, data }) => {
    await Db.insertTestData(db.connection, [
      { collection: COLLECTION_NAME, objects: data }
    ])

    const collection = db.connection.collection(COLLECTION_NAME)

    const pipeline = textSearchPipeline(input)

    const results = await collection
      .aggregate(pipeline)
      .sort({ score: -1 })
      .toArray()

    const addresses = results.map((result) => result.address)

    expect(addresses).toEqual(expected)

    await Db.removeTestData(db.connection, [
      { collection: COLLECTION_NAME, objects: data }
    ])
  })
})
