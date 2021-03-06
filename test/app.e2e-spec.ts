import { cwd } from 'process'
import { config as configure } from 'dotenv'
configure({ path: `${cwd()}/.env.test` })

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import config from '../src/config'
import { Connection } from 'mongoose'
import { connectToRealDb, insertTestData, removeTestData } from './db'

const get = async (app: INestApplication, query: any) => {
  const res = await request(app.getHttpServer())
    .post('/graphql')
    .set('x-api-key', config().app.apiKey)
    .set('Content-Type', 'application/json')
    .send(`{"query":"{${query}}"}`)
    .expect(200)

  return res.body.data
}

const cases = [
  {
    toString: () => 'devices',
    singular: 'device',
    plural: 'devices',
    idField: 'address',
    id: '3MFnBNTTCqQHuFX3H8p9ZWzccvLrwfBELkB',
    name: 'test'
  },
  {
    toString: () => 'events',
    singular: 'event',
    plural: 'events',
    id: 'EEgeBai5os5MbkE8qybjVq6DAPfhTrgMQZRSvUrMqQSL',
    idField: 'txHash',
    collection: 'events'
  },
  {
    toString: () => 'keys',
    singular: 'key',
    plural: 'keys',
    id: 'C28XsGGGKbmqiMruZCuBBSuXDc4Hsx4NXdmygi8QDyWn',
    idField: 'assetId',
    collection: 'keys',
    name: 'test'
  },
  {
    toString: () => 'organisations',
    singular: 'organisation',
    plural: 'organisations',
    id: '3MQBMVe3htusKJTpf7vGHnu2c7Wd6XjNHvd',
    idField: 'address',
    collection: 'organisations',
    name: 'test'
  },
  {
    toString: () => 'suppliers',
    singular: 'supplier',
    plural: 'suppliers',
    id: '3M1he2S9iiLqj4M4D9dG4BAGkMYvHwHEg87',
    idField: 'address',
    collection: 'suppliers',
    name: 'test'
  }
]

describe('AppController (e2e)', () => {
  let app: INestApplication
  let conn: Connection

  beforeAll(async () => {
    conn = await connectToRealDb()

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await conn.close()
    await app.close()
  })

  describe.each(cases)('%s', (args) => {
    beforeEach(async () => {
      await conn.collection(args.plural).insertOne({ [args.idField]: args.id })
    })

    afterEach(async () => {
      await conn.collection(args.plural).deleteOne({ [args.idField]: args.id })
    })

    it('single item', async () => {
      const query = `${args.singular} (${args.idField}: \\"${args.id}\\") { ${args.idField} }`
      const res = await get(app, query)

      expect(res).toEqual({ [args.singular]: { [args.idField]: args.id } })
    })

    it('multiple items', async () => {
      const query = `${args.plural} { objects { ${args.idField} } }`
      const res = await get(app, query)

      expect(res[args.plural].objects.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('search', () => {
    const fields = cases.map((x) => `${x.plural}{${x.idField}}`)
    const query = `search(input:\\"test\\"){${fields.join()}}`

    const items = cases.map((c) => ({
      collection: c.plural,
      objects: [{ [c.idField]: c.id, name: c.name }]
    }))

    beforeEach(async () => {
      await insertTestData(conn, items)
    })

    afterEach(async () => {
      await removeTestData(conn, items)
    })

    it('returns items', async () => {
      const res = await get(app, query)

      expect(res.search.devices.length).toBe(1)
      expect(res.search.keys.length).toBe(1)
      expect(res.search.organisations.length).toBe(1)
      expect(res.search.suppliers.length).toBe(1)
    })
  })
})
