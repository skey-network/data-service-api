import { GeoSearchCircleInput, Point } from '../devices/devices.args'
import * as Db from '../../test/db'
import geoSearchCirclePipeline from './geoSearchCircle.query'
import { computeDestinationPoint } from 'geolib'
import { Logger } from '@nestjs/common'
import { IndexConfig } from '../utils/index.config'
import { IndexService } from '../utils/index.service'

const COLLECTION_NAME = 'devices'

const indexConfig: IndexConfig = {
  collection: COLLECTION_NAME,
  type: '2dsphere',
  fields: ['location']
}

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const getRandomPointInDistance = (center: Point, distance: number) => {
  return computeDestinationPoint(center, distance, getRandomInt(0, 359))
}

const center = { lng: 20.47958, lat: 53.77864 }

const distances = [50, 20, 210, 65, 90, 40, 330]

const devicesAround = distances.map((distance: number, i: number) => {
  const cords = getRandomPointInDistance(center, distance)
  return {
    id: i + 1,
    name: `DEVICE_${distance}`,
    lat: cords.latitude,
    lng: cords.longitude,
    location: {
      type: 'Point',
      coordinates: [cords.longitude, cords.latitude]
    }
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
    toString: () => 'returns Devices within 150 meters sorted by distance',
    args: { center, radius: 150 },
    expected: [2, 6, 1, 4, 5]
  },
  {
    toString: () => 'returns Devices within 300 meters sorted by distance',
    args: { center, radius: 300 },
    expected: [2, 6, 1, 4, 5, 3]
  }
]

describe('geoSearchCircle query', () => {
  let db: Db.TestInstance

  beforeAll(async () => {
    Logger.overrideLogger(false)

    db = await Db.getInstance()
    await Db.insertTestData(db.connection, [testData])

    const service = new IndexService(db.connection)
    await service.handleIndexes([indexConfig])
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
