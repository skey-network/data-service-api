import { MongooseModule } from '@nestjs/mongoose'
import { defaultCoreCipherList } from 'constants'
import { MongoMemoryServer } from 'mongodb-memory-server'
import {
  createConnection,
  Connection,
  model,
  ConnectOptions,
  Mongoose,
  connection
} from 'mongoose'
import { options } from '../src/database/database.module'

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

export const getMockedModule = (dbInstance: TestInstance) =>
  MongooseModule.forRoot(dbInstance.mongod.getUri(), dbInstance.options)

export const getInstance = async (): Promise<TestInstance> => {
  const mongod = await MongoMemoryServer.create()
  const connection = await createConnection(mongod.getUri(), options)

  const cleanup = async () => {
    await connection.close()
    await mongod.stop()
  }

  return { mongod, connection, options, cleanup }
}

export const insertTestData = async (
  db: TestInstance,
  collections: TestCollection[]
) => {
  for (const { collection, objects } of collections) {
    await db.connection.collection(collection).insertMany(objects)
  }
}
