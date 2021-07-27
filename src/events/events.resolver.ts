import { Args, Query, Resolver } from '@nestjs/graphql'
import { EventsArgs, EventArgs } from './events.args'
import { Event, PaginatedEvents } from './events.schema'
import { EventsService } from './events.service'

@Resolver(() => Event)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}

  @Query(() => PaginatedEvents)
  async events(@Args() args: EventsArgs) {
    return await this.eventsService.findAll(args)
  }

  @Query(() => Event)
  async event(@Args() args: EventArgs) {
    return await this.eventsService.findOne(args)
  }
}
