import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import type { ConnectOptions } from 'mongoose'
import config from '../config'
import { DatabaseService } from './database.service'

export interface DatabaseOptions {
  host: string
  port: number
  name: string
  username: string
  password: string
}

export const createUri = (options: DatabaseOptions) => {
  const { host, port, name, username, password } = options
  return `mongodb://${username}:${password}@${host}:${port}/${name}`
}

export const options: ConnectOptions = Object.freeze({
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  validateOptions: true
})

const uri = createUri(config().database)

@Global()
@Module({
  imports: [MongooseModule.forRoot(uri, options)],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {}
