import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import type { IndexConfig, SearchIndexConfig, GeoSphereConfig } from './index.config'

@Injectable()
export class IndexService {
  constructor(@InjectConnection() private conn: Connection) {}

  private logger = new Logger(IndexService.name)

  private indexName = (config: IndexConfig) => {
    switch (config.type) {
      case '2dsphere':
        return `${config.fields.join('_')}_2dsphere`
      case 'textSearch':
        return `${config.collection}_text_search`
    }
  }

  public async handleIndexes(configs: IndexConfig[]) {
    this.logger.debug('Checking Indexes ...')

    await Promise.all(configs.map(this.handleIndex.bind(this)))

    this.logger.debug('Indexes checked')
  }

  //TODO refactor
  private async createIndex(config: IndexConfig) {
    switch (config.type) {
      case 'textSearch':
        return await this.createTextSearchIndex(config)
      case '2dsphere':
        return await this.createGeoSphereIndex(config)
    }
  }

  private async createTextSearchIndex(config: SearchIndexConfig) {
    const weights = config.fields
      .map(({ key, weight }) => ({ [key]: weight }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {})

    const list = config.fields
      .map(({ key }) => ({ [key]: 'text' }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {})

    return this.conn.db
      .collection(config.collection)
      .createIndex(list, { weights, name: this.indexName(config) } as any)
  }

  private async createGeoSphereIndex(config: GeoSphereConfig) {
    const list = config.fields
      .map((field: string) => ({ [field]: '2dsphere' }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {})

    return this.conn.db
      .collection(config.collection)
      .createIndex(list, { name: this.indexName(config) } as any)
  }

  private async assertCollection(name: string) {
    await this.conn.db.createCollection(name).catch(() => {})
  }

  private async handleIndex(config: IndexConfig) {
    await this.assertCollection(config.collection)

    const indexName = this.indexName(config)

    const exists = await this.conn.db
      .collection(config.collection)
      .indexExists(indexName)

    if (exists) return

    this.logger.debug(
      `${indexName} index for collection ${config.collection} not found, creating new ...`
    )

    await this.createIndex(config)

    this.logger.debug(
      `${indexName} index for collection ${config.collection} created`
    )
  }
}
