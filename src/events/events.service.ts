import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { filterPipeline } from '../queries/standardIndex.query'
import { Event, EventModel } from './events.schema'
import { EventsArgs, EventFilterFields, EventArgs } from './events.args'
import { runQuery } from 'src/common/common.functions'

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: EventModel) {}

  async findAll(args: EventsArgs) {
    const pipeline = filterPipeline(args, EventFilterFields)

    return await runQuery(this.eventModel, args, pipeline)
  }

  async findOne(args: EventArgs) {
    const event = await this.eventModel.findOne({ txHash: args.txHash })
    if (!event) throw new NotFoundException()

    return event
  }
}
