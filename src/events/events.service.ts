import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { indexQuery } from '../common/query'
import { Event, EventModel } from './events.schema'
import { EventsArgs, EventFilterFields, EventArgs } from './events.args'

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: EventModel) {}

  async findAll(args: EventsArgs) {
    return await indexQuery(this.eventModel, EventFilterFields, args)
  }

  async findOne(args: EventArgs) {
    const event = await this.eventModel.findOne({ txHash: args.txHash })
    if (!event) throw new NotFoundException()

    return event
  }
}
