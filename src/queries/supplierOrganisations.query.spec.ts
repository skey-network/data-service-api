import * as Db from '../../test/db'
import { supplierOrganisationsPipeline } from './supplierOrganisations.query'
import * as Util from 'util'
import { util } from 'prettier'

const organisations: Db.TestCollection = {
  collection: 'organisations',
  objects: [
    { address: 'org_1', name: 'org_1_name', description: 'org_1_desc' },
    { address: 'org_2', name: 'org_2_name', description: 'org_2_desc' },
    { address: 'org_3' }
  ]
}

const suppliers: Db.TestCollection = {
  collection: 'suppliers',
  objects: [
    { address: 'sup_1', organisations: ['org_1', 'org_2'] },
    { address: 'sup_2', organisations: ['org_1'] },
    { address: 'sup_3' }
  ]
}

const cases = [
  {
    toString: () => 'basic example',
    supplier: 'sup_2',
    expected: [{ address: 'org_1', name: 'org_1_name', description: 'org_1_desc' }]
  },
  {
    toString: () => 'multiple organisations',
    supplier: 'sup_1',
    expected: [
      { address: 'org_1', name: 'org_1_name', description: 'org_1_desc' },
      { address: 'org_2', name: 'org_2_name', description: 'org_2_desc' }
    ]
  },
  {
    toString: () => 'no organisations',
    supplier: 'sup_3',
    expected: []
  }
]

describe('index query', () => {
  let db: Db.TestInstance

  beforeAll(async () => {
    db = await Db.getInstance()
    await Db.insertTestData(db.connection, [organisations, suppliers])
  })

  afterAll(async () => {
    await db.cleanup()
  })

  it.each(cases)('%s', async ({ supplier, expected }) => {
    const collection = db.connection.collection('organisations')
    const pipeline = [...supplierOrganisationsPipeline(supplier)]

    const results = await (
      await collection.aggregate(pipeline).toArray()
    ).map((obj) => {
      const { _id, ...rest } = obj
      return rest
    })

    Util.inspect(results, { showHidden: false, depth: null })

    expect(results).toEqual(expected)
  })
})
