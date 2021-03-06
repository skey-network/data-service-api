import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { Paginated } from '../common/common.interfaces'

export type EventDocument = Event & Document
export type EventModel = Model<EventDocument>

@Schema()
@ObjectType()
export class Event {
  @Field(() => ID)
  id: string

  @Prop(String)
  @Field(() => String)
  txHash: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  sender?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  device?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  assetId?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  action?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  status?: string

  @Prop(Date)
  @Field(() => Date, { nullable: true })
  createdAt: Date

  @Prop(Date)
  @Field(() => Date, { nullable: true })
  updatedAt: Date

  // ==============================
  // GRAPHQL ONLY
  // ==============================

  @Field(() => Float, { nullable: true })
  score?: number
}

@ObjectType()
export class PaginatedEvents extends Paginated(Event) {}

export const EventSchema = SchemaFactory.createForClass(Event)
