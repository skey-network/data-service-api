import { MongooseModule } from '@nestjs/mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, ConnectOptions } from 'mongoose'
import { createUri, options } from '../src/database/database.module'
import { createConnection } from 'mongoose'
import config from '../src/config'

export const VERSION = '4.4.7'

export interface TestInstance {
  mongod: MongoMemoryServer
  connection: Connection
  options: ConnectOptions
  cleanup: () => Promise<void>
}

export interface TestCollection {
  collection: string
  objects: any[]
}

export const connectToRealDb = async () => {
  return await createConnection(createUri(config().database), options)
}

export const getMockedModule = (dbInstance: TestInstance) =>
  MongooseModule.forRoot(dbInstance.mongod.getUri(), dbInstance.options)

export const getInstance = async (): Promise<TestInstance> => {
  const mongod = await MongoMemoryServer.create({ binary: { version: VERSION } })
  const connection = await createConnection(mongod.getUri(), options)

  const cleanup = async () => {
    await connection.close()
    await mongod.stop()
  }

  return { mongod, connection, options, cleanup }
}

export const insertTestData = async (
  connection: Connection,
  collections: TestCollection[]
) => {
  for (const { collection, objects } of collections) {
    await connection.collection(collection).insertMany(objects)
  }
}

export const removeTestData = async (
  connection: Connection,
  collections: TestCollection[]
) => {
  for (const { collection, objects } of collections) {
    const conn = connection.collection(collection)
    await Promise.all(objects.map((obj) => conn.remove(obj)))
  }
}
