import { GeoSearchInput } from '../devices/devices.args'
import * as Db from '../../test/db'
import { geoSearchPipeline } from './geoSearch.query'

const COLLECTION_NAME = 'devices'

const testData: Db.TestCollection = {
  collection: COLLECTION_NAME,
  objects: [
    { id: 1, name: ' OL_NE', lat: 53.78415233868915, lng: 20.5105699426855 },
    { id: 2, name: ' OL_NW', lat: 53.783309527823015, lng: 20.474274086613104 },
    { id: 3, name: ' OL_SE', lat: 53.761296807097864, lng: 20.5105699426855 },
    { id: 4, name: ' OL_SW', lat: 53.759703949756, lng: 20.46983616534661 },
    { id: 5, name: ' NOT_OL', lat: 53.63977934356183, lng: 20.490638389264852 },

    { id: 6, name: 'TURKEY', lat: 38.8324659983152, lng: 38.524230852799306 },
    { id: 7, name: 'NIGER', lat: 20.047841622891866, lng: 12.308094591335927 },
    {
      id: 8,
      name: 'AUSTRALIA',
      lat: -22.35803952997546,
      lng: 134.82762258999423
    },
    { id: 9, name: 'BRASIL', lat: -10.546879742936383, lng: -52.918817092831006 },
    { id: 10, name: 'USA', lat: 39.86192840833119, lng: -107.80651052426423 },
    {
      id: 11,
      name: 'GREENLAND',
      lat: 74.14707430377875,
      lng: -42.064324768886614
    },
    {
      id: 12,
      name: 'OCEAN_1',
      lat: -62.215071438613975,
      lng: -163.88073010459252
    },
    { id: 13, name: ' OCEAN_2', lat: 80.07762191115216, lng: -171.61510629877236 },
    { id: 14, name: 'LA_1', lat: 33.89401386037194, lng: -118.2764251082934 },
    { id: 15, name: 'LA_2', lat: 33.78532501049537, lng: -117.7384615396363 },
    { id: 16, name: 'LA_3', lat: 33.966396251343234, lng: -117.52036820099156 },
    { id: 17, name: ' NOT_LA', lat: 33.16073335663618, lng: -116.22634772503268 }
  ]
}

const cases = [
  {
    toString: () => 'devices in olsztyn',
    args: [
      53.733708863399784, 20.422562441668152, 53.81787639471819, 20.5776110691132
    ],
    expected: [1, 2, 3, 4]
  },
  {
    toString: () => 'devices in Los Angeles',
    args: [
      33.24868201002417, -119.20873846958939, 34.55545553962698, -116.45615829562799
    ],
    expected: [14, 15, 16]
  },
  {
    toString: () => 'all devices',
    args: [-90, -180, 90, 180],
    expected: testData.objects.map(({ id }) => id)
  },
  {
    toString: () => 'greenland',
    args: [
      74.13707430377875, -42.074324768886614, 74.15707430377875, -42.044324768886614
    ],
    expected: [11]
  }
]

describe('geoSearch query', () => {
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

    const input: GeoSearchInput = {
      bottomLeft: { lat: args[0], lng: args[1] },
      upperRight: { lat: args[2], lng: args[3] }
    }

    const pipeline = geoSearchPipeline(input)

    const results = await collection.aggregate(pipeline).toArray()

    const ids = results.map((result) => result.id)

    expect(ids).toEqual(expected)
  })
})
