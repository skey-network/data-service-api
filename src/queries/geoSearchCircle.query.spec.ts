import { GeoSearchCircleInput, Point } from '../devices/devices.args'
import * as Db from '../../test/db'
import geoSearchCirclePipeline from './geoSearchCircle.query'
import { computeDestinationPoint } from 'geolib'

const COLLECTION_NAME = 'devices'

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const getRandomPointInDistance = (center: Point, distance: number) => {
  return computeDestinationPoint(center, distance, getRandomInt(0, 359))
}

const center = { lng: 20.47958, lat: 53.77864 }

const distances = [20, 50, 100, 200, 500, 1000, 10000]

const devicesAround = distances.map((distance: number, i: number) => {
  const cords = getRandomPointInDistance(center, distance)
  return {
    id: i + 1,
    name: `DEVICE_${distance}`,
    lat: cords.latitude,
    lng: cords.longitude
  }
})

const testData: Db.TestCollection = {
  collection: COLLECTION_NAME,
  objects: devicesAround
}

const cases = [
  {
    toString: () => 'returns an empty list',
    args: { center, radius: 10 },
    expected: []
  },
  {
    toString: () => 'returns Devices within 150 meters',
    args: { center, radius: 150 },
    expected: [1, 2, 3]
  },
  {
    toString: () => 'returns Devices within 300 meters',
    args: { center, radius: 300 },
    expected: [1, 2, 3, 4]
  }
]

describe('geoSearchCircle query', () => {
  let db: Db.TestInstance

  beforeAll(async () => {
    db = await Db.getInstance()
    await Db.insertTestData(db.connection, [testData])
  })

  afterAll(async () => {
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ args, expected }) => {
    const collection = db.connection.collection(COLLECTION_NAME)

    const input: GeoSearchCircleInput = args

    const pipeline = geoSearchCirclePipeline(input)

    const results = await collection.aggregate(pipeline).toArray()

    const ids = results.map((result) => result.id)

    expect(ids).toEqual(expected)
  })
})
