import * as Db from '../../test/db'
import { CommonIndexArgs } from '../common/common.args'
import { standardIndexPipeline } from './standardIndex.query'

const COLLECTION_NAME = 'items'

const testData: Db.TestCollection = {
  collection: COLLECTION_NAME,
  objects: [
    { id: '1', bool: true, num: 10, str: 'circle' },
    { id: '2', bool: true, num: 20 },
    { id: '3', bool: false, num: 20, str: 'circle' },
    { id: '4', bool: false, num: 10, str: 'box' },
    { id: '5', str: 'box' },
    { id: '6', bool: true, str: 'steve' },
    { id: '7', bool: false, str: 'aaaa' },
    { id: '8', bool: false, str: 'aabb' },
    { id: '9', bool: true, num: 300000 },
    { id: '10', bool: true, num: -300 },
    { id: '11', num: 30, str: 'circle' },
    { id: '12', num: 20 },
    { id: '13', str: 'ab', num: 777 },
    { id: '14', str: 'ac', num: 777 },
    { id: '15', str: 'ad', num: 777 },
    { id: '16', num: 145, str: 'desc' },
    { id: '17', num: 156, str: 'desc' },
    { id: '18', num: 789, str: 'desc' }
  ]
}

const allIds = () => testData.objects.map((obj) => Number(obj.id))

const cases = [
  {
    toString: () => 'filter by bool true',
    whitelist: ['bool'],
    args: {
      bool: true
    },
    expected: [1, 2, 6, 9, 10]
  },
  {
    toString: () => 'filter by bool false',
    whitelist: ['bool'],
    args: {
      bool: false
    },
    expected: [3, 4, 7, 8]
  },
  {
    toString: () => 'filter by string value',
    whitelist: ['str'],
    args: {
      str: 'circle'
    },
    expected: [1, 3, 11]
  },
  {
    toString: () => 'filter by number value',
    whitelist: ['num'],
    args: {
      num: 20
    },
    expected: [2, 3, 12]
  },
  {
    toString: () => 'non whitelisted field',
    whitelist: [],
    args: {
      aaaa: false
    },
    expected: allIds()
  },
  {
    toString: () => 'filter by multiple values',
    whitelist: ['str', 'num', 'bool'],
    args: {
      bool: false,
      num: 20,
      str: 'circle'
    },
    expected: [3]
  },
  {
    toString: () => 'default args',
    whitelist: [],
    args: {},
    expected: allIds()
  },
  {
    toString: () => 'asc order',
    whitelist: ['num'],
    args: {
      num: 777,
      orderBy: 'str',
      order: 'asc' as 'asc'
    },
    expected: [13, 14, 15]
  },
  {
    toString: () => 'desc order',
    whitelist: ['str'],
    args: {
      str: 'desc',
      orderBy: 'num',
      order: 'desc' as 'desc'
    },
    expected: [18, 17, 16]
  },
  {
    toString: () => 'pagination - page 1',
    whitelist: [],
    args: {
      take: 3,
      skip: 0
    },
    expected: [1, 2, 3]
  },
  {
    toString: () => 'pagination - page 2',
    whitelist: [],
    args: {
      take: 3,
      skip: 3
    },
    expected: [4, 5, 6]
  },
  {
    toString: () => 'pagination - page 3',
    whitelist: [],
    args: {
      take: 3,
      skip: 6
    },
    expected: [7, 8, 9]
  },
  {
    toString: () => 'example 1',
    whitelist: ['str', 'bool'],
    args: {
      bool: true,
      take: 4,
      skip: 0
    },
    expected: [1, 2, 6, 9]
  },
  {
    toString: () => 'example 2',
    whitelist: ['str', 'bool', 'num'],
    args: {
      num: 777,
      str: 'ac'
    },
    expected: [14]
  },
  {
    toString: () => 'last item',
    whitelist: [],
    args: {
      take: 999999,
      skip: testData.objects.length - 1
    },
    expected: [Number(testData.objects[testData.objects.length - 1].id)]
  },
  {
    toString: () => 'no results',
    whitelist: ['str'],
    args: {
      str: 'hello there?'
    },
    expected: []
  }
]

describe('index query', () => {
  let db: Db.TestInstance

  beforeAll(async () => {
    db = await Db.getInstance()

    await Db.insertTestData(db, [testData])
  })

  afterAll(async () => {
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ args, whitelist, expected }) => {
    const defaults = new CommonIndexArgs()
    const input = { ...defaults, ...args }

    const collection = db.connection.collection(COLLECTION_NAME)
    const pipeline = standardIndexPipeline(input, whitelist)

    const results = await collection.aggregate(pipeline).toArray()

    const ids = results.map((result) => Number(result.id))

    expect(ids).toEqual(expected)
  })
})
