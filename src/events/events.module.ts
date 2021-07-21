import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventsResolver } from './events.resolver'
import { Event, EventSchema } from './events.schema'
import { EventsService } from './events.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  providers: [EventsResolver, EventsService]
})
export class EventsModule {}
