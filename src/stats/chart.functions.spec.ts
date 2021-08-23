import {
  getInstance,
  insertTestData,
  removeTestData,
  TestCollection,
  TestInstance
} from '../../test/db'
import { createChunks, getChartData } from './chart.functions'

describe('createChunks', () => {
  const cases = [
    {
      toString: () => 'simple case',
      input: {
        begin: 168,
        length: 24,
        n: 7
      },
      expected: [
        { index: 0, min: 168, max: 191 },
        { index: 1, min: 192, max: 215 },
        { index: 2, min: 216, max: 239 },
        { index: 3, min: 240, max: 263 },
        { index: 4, min: 264, max: 287 },
        { index: 5, min: 288, max: 311 },
        { index: 6, min: 312, max: 335 }
      ]
    },
    {
      toString: () => 'year chart',
      input: {
        begin: 1577836800000, // 01.01.2020,
        length: 30 * 24 * 3600 * 1000, // 1 month
        n: 12
      },
      expected: [
        { index: 0, min: 1577836800000, max: 1580428799999 },
        { index: 1, min: 1580428800000, max: 1583020799999 },
        { index: 2, min: 1583020800000, max: 1585612799999 },
        { index: 3, min: 1585612800000, max: 1588204799999 },
        { index: 4, min: 1588204800000, max: 1590796799999 },
        { index: 5, min: 1590796800000, max: 1593388799999 },
        { index: 6, min: 1593388800000, max: 1595980799999 },
        { index: 7, min: 1595980800000, max: 1598572799999 },
        { index: 8, min: 1598572800000, max: 1601164799999 },
        { index: 9, min: 1601164800000, max: 1603756799999 },
        { index: 10, min: 1603756800000, max: 1606348799999 },
        { index: 11, min: 1606348800000, max: 1608940799999 }
      ]
    }
  ]

  it.each(cases)('%s', ({ input, expected }) => {
    expect(createChunks(input)).toEqual(expected)
  })
})

describe('parseResults', () => {
  let db: TestInstance

  const data: TestCollection = {
    collection: 'items',
    objects: [
      {
        type: 'item',
        id: 'id',
        historical: [
          { timestamp: 10, data: '1' },
          { timestamp: 20, data: '2' },
          { timestamp: 30, data: '3' },
          { timestamp: 40, data: '4' },
          { timestamp: 50, data: '5' },
          { timestamp: 60, data: '6' },
          { timestamp: 70, data: '7' },
          { timestamp: 80, data: '8' },
          { timestamp: 90, data: '9' }
        ]
      }
    ]
  }

  const cases = [
    {
      toString: () => 'basic example',
      input: { begin: 10, n: 3, length: 10 },
      expected: [
        { index: 0, timestamp: 10, data: '1' },
        { index: 1, timestamp: 20, data: '2' },
        { index: 2, timestamp: 30, data: '3' }
      ]
    },
    {
      toString: () => 'before first record',
      input: { begin: 0, n: 3, length: 10 },
      expected: [
        { index: 1, timestamp: 10, data: '1' },
        { index: 2, timestamp: 20, data: '2' }
      ]
    },
    {
      toString: () => 'after last record',
      input: { begin: 80, n: 4, length: 10 },
      expected: [
        { index: 0, timestamp: 80, data: '8' },
        { index: 1, timestamp: 90, data: '9' }
      ]
    },
    {
      toString: () => 'long period',
      input: { begin: 10, n: 1, length: 90 },
      expected: [{ index: 0, timestamp: 90, data: '9' }] // Should return latest matching item
    },
    {
      toString: () => 'middle',
      input: { begin: 50, n: 1, length: 20 },
      expected: [{ index: 0, timestamp: 60, data: '6' }] // Should return latest matching item
    }
  ]

  beforeAll(async () => {
    db = await getInstance()
    await insertTestData(db.connection, [data])
  })

  afterAll(async () => {
    await removeTestData(db.connection, [data])
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ input, expected }) => {
    const col = db.connection.collection('items')
    const item = await col.findOne({ type: 'item', id: 'id' })

    const results = getChartData(item.historical, input)

    expect(results).toEqual(expected)
  })
})
