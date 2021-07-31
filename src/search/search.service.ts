import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import type { Connection } from 'mongoose'
import { DatabaseService } from '../database/database.service'
import { sortPipeline } from '../queries/standardIndex.query'
import { SearchArgs } from './search.args'
import { searchPipeline } from './search.pipeline'
import { collections, SearchResults } from './search.schema'

@Injectable()
export class SearchService {
  constructor(
    @InjectConnection() private conn: Connection,
    private databaseService: DatabaseService
  ) {}

  readonly collectionName = 'meta'
  readonly itemName = 'searchPlaceholder'

  private logger = new Logger(SearchService.name)

  async search(args: SearchArgs) {
    const pipeline = [
      ...searchPipeline(collections, args.input),
      ...sortPipeline({ order: 'desc', orderBy: 'score' })
    ]

    const result = await this.databaseService.query(
      this.conn.collection(this.collectionName),
      pipeline,
      args
    )

    return {
      ...this.sortItems(result.objects),
      meta: result.meta
    }
  }

  private initalSearchResult = (): SearchResults =>
    collections.reduce((prev, curr) => ({ ...prev, [curr]: [] }), {}) as any

  private sortItems = (items: any[]): SearchResults => {
    return items
      .filter(this.itemsFilter)
      .reduce(this.itemsReducer, this.initalSearchResult())
  }

  private itemsReducer = (prev: SearchResults, curr: any) => ({
    ...prev,
    [curr.type]: [...prev[curr.type], curr]
  })

  private itemsFilter = (item: any) => {
    if (!collections.includes(item.type)) {
      this.logger.error(`Expected one of ${collections}, received ${item.type}`)
      return false
    }

    return true
  }

  async assertPlaceholder() {
    this.logger.debug('Checking meta collection ...')

    await this.conn
      .collection(this.collectionName)
      .updateOne(
        { name: this.itemName },
        { $set: { name: this.itemName } },
        { upsert: true }
      )

    this.logger.debug('Meta collection is valid')
  }
}
