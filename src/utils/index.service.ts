import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import type { IndexConfig } from './index.config'

@Injectable()
export class IndexService {
  constructor(@InjectConnection() private conn: Connection) {}

  private logger = new Logger(IndexService.name)

  private indexName = (collectionName: string) => `${collectionName}_text_search`

  public async handleIndexes(configs: IndexConfig[]) {
    this.logger.debug('Checking text search indexes ...')

    await Promise.all(configs.map(this.handleIndex.bind(this)))

    this.logger.debug('Text search indexes checked')
  }

  private async createIndex(config: IndexConfig) {
    const weights = config.fields
      .map(({ key, weight }) => ({ [key]: weight }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {})

    const list = config.fields
      .map(({ key }) => ({ [key]: 'text' }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {})

    return await this.conn.db
      .collection(config.collection)
      .createIndex(list, { weights, name: this.indexName(config.collection) } as any)
  }

  private async assertCollection(name: string) {
    await this.conn.db.createCollection(name).catch(() => {})
  }

  private async handleIndex(config: IndexConfig) {
    await this.assertCollection(config.collection)

    const exists = await this.conn.db
      .collection(config.collection)
      .indexExists(this.indexName(config.collection))

    if (exists) return

    this.logger.debug(`${config.collection} text index not found, creating new ...`)

    await this.createIndex(config)

    this.logger.debug(`${config.collection} text index created`)
  }
}
