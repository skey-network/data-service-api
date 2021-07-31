import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { filterPipeline } from '../queries/standardIndex.query'
import { Event, EventModel } from './events.schema'
import { EventsArgs, EventFilterFields, EventArgs } from './events.args'
import { textSearchPipeline } from '../queries/textSearch.query'
import { sortPipeline } from '../queries/standardIndex.query'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: EventModel,
    private databaseService: DatabaseService
  ) {}

  async findAll(args: EventsArgs) {
    const pipeline = [
      ...textSearchPipeline(args.search),
      ...filterPipeline(args.filter, EventFilterFields),
      ...sortPipeline(args)
    ]

    return await this.databaseService.query(
      this.eventModel.collection,
      pipeline,
      args
    )
  }

  async findOne(args: EventArgs) {
    return await this.databaseService.findOne(
      this.eventModel.collection,
      'txHash',
      args.txHash
    )
  }
}
