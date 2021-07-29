import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { filterPipeline } from '../queries/standardIndex.query'
import { Event, EventModel } from './events.schema'
import { EventsArgs, EventFilterFields, EventArgs } from './events.args'
import { getItem, runQuery } from '../common/common.functions'
import { textSearchPipeline } from '../queries/textSearch.query'

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: EventModel) {}

  async findAll(args: EventsArgs) {
    const pipeline = [
      ...textSearchPipeline(args.search),
      ...filterPipeline(args.filter, EventFilterFields)
    ]

    return await runQuery(this.eventModel, args, pipeline)
  }

  async findOne(args: EventArgs) {
    return await getItem(this.eventModel, 'txHash', args.txHash)
  }
}
