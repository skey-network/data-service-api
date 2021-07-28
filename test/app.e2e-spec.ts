import { cwd } from 'process'
import { config as configure } from 'dotenv'
configure({ path: `${cwd()}/.env.test` })

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import config from '../src/config'
import { Connection } from 'mongoose'
import {
  connectToRealDb,
  insertTestData,
  removeTestData,
  TestCollection
} from './db'

const get = async (app: INestApplication, query: any) => {
  return await request(app.getHttpServer())
    .post('/graphql')
    .set('x-api-key', config().app.apiKey)
    .set('Content-Type', 'application/json')
    .send(`{"query":"{${query}}"}`)
    .expect(200)
}

const testData: TestCollection[] = [
  {
    collection: 'devices',
    objects: [{ address: '3MFnBNTTCqQHuFX3H8p9ZWzccvLrwfBELkB' }]
  },
  {
    collection: 'events',
    objects: [{ txHash: 'EEgeBai5os5MbkE8qybjVq6DAPfhTrgMQZRSvUrMqQSL' }]
  },
  {
    collection: 'keys',
    objects: [{ assetId: 'C28XsGGGKbmqiMruZCuBBSuXDc4Hsx4NXdmygi8QDyWn' }]
  },
  {
    collection: 'organisations',
    objects: [{ address: '3MQBMVe3htusKJTpf7vGHnu2c7Wd6XjNHvd' }]
  },
  {
    collection: 'suppliers',
    objects: [{ address: '3M1he2S9iiLqj4M4D9dG4BAGkMYvHwHEg87' }]
  }
]

describe('AppController (e2e)', () => {
  let app: INestApplication
  let conn: Connection

  beforeAll(async () => {
    conn = await connectToRealDb()
    await insertTestData(conn, testData)

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await removeTestData(conn, testData)
    await conn.close()
    await app.close()
  })

  it('devices', async () => {
    const query = 'devices { objects { name } }'
    const result = await get(app, query)
    console.log(JSON.stringify(result.body, null, 2))
  })
})
