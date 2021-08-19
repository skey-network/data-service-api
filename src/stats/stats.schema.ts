import { Type } from '@nestjs/common'
import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model, Types } from 'mongoose'

// ==================================================
// Database
// ==================================================

export type StatsDocument = Stats & Document
export type StatsModel = Model<StatsDocument>

@Schema({ collection: 'stats' })
export class Stats {
  @Prop(String)
  id: string

  @Prop(String)
  type: string

  @Prop({ type: Types.Map })
  current: any

  @Prop({ type: Types.Array })
  historical?: any[]
}

export const StatsSchema = SchemaFactory.createForClass(Stats)

// ==================================================
// Models Stats
// ==================================================

@ObjectType()
export class DevicesStats {
  @Field(() => Float, { nullable: true })
  all: number

  @Field(() => Float, { nullable: true })
  active_false: number

  @Field(() => Float, { nullable: true })
  active_true: number

  @Field(() => Float, { nullable: true })
  connected_false: number

  @Field(() => Float, { nullable: true })
  connected_true: number

  @Field(() => Float, { nullable: true })
  visible_false: number

  @Field(() => Float, { nullable: true })
  visible_true: number
}

@ObjectType()
export class EventsStats {
  @Field(() => Float, { nullable: true })
  all: number
}

@ObjectType()
export class KeysStats {
  @Field(() => Float, { nullable: true })
  all: number

  @Field(() => Float, { nullable: true })
  burned_false: number

  @Field(() => Float, { nullable: true })
  burned_true: number
}

@ObjectType()
export class OrganisationsStats {
  @Field(() => Float, { nullable: true })
  whitelisted: number
}

@ObjectType()
export class UsersStats {
  @Field(() => Float, { nullable: true })
  whitelisted: number
}

// ==================================================
// Models Data
// ==================================================

@ObjectType()
export class SuppliersData {
  @Field(() => DevicesStats)
  devices: DevicesStats

  @Field(() => EventsStats)
  events: EventsStats

  @Field(() => KeysStats)
  keys: KeysStats

  @Field(() => OrganisationsStats)
  organisations: OrganisationsStats
}

@ObjectType()
export class OrganisationsData {
  @Field(() => DevicesStats)
  devices: DevicesStats

  @Field(() => KeysStats)
  keys: KeysStats

  @Field(() => UsersStats)
  users: UsersStats
}

@ObjectType()
export class KeysData {
  @Field(() => EventsStats)
  events: EventsStats
}

@ObjectType()
export class DevicesData {
  @Field(() => EventsStats)
  events: EventsStats

  @Field(() => KeysStats)
  keys: KeysStats
}

// ==================================================
// Auto generated classes
// ==================================================

export const StatsSubDocument = <T>(classRef: Type<T>): any => {
  @ObjectType()
  class Tmp {
    @Field(() => Float, { nullable: true })
    timestamp: number

    @Field(() => classRef, { nullable: true })
    data: T
  }

  return Tmp
}

export const StatsMainDocument = <T>(classRef: Type<T>): any => {
  @ObjectType()
  class Tmp {
    @Field(() => String, { nullable: true })
    id: string

    @Field(() => String, { nullable: true })
    type: string

    @Field(() => classRef, { nullable: true })
    current: T

    @Field(() => [classRef], { nullable: true })
    historical?: T[]
  }

  return Tmp
}

// ==================================================
// Response types
// ==================================================

@ObjectType()
export class SupplierSubDocument extends StatsSubDocument(SuppliersData) {}

@ObjectType()
export class OrganisationSubDocument extends StatsSubDocument(OrganisationsData) {}

@ObjectType()
export class DeviceSubDocument extends StatsSubDocument(DevicesData) {}

@ObjectType()
export class KeySubDocument extends StatsSubDocument(KeysData) {}

@ObjectType()
export class SupplierMainDocument extends StatsMainDocument(SupplierSubDocument) {}

@ObjectType()
export class OrganisationMainDocument extends StatsMainDocument(
  OrganisationSubDocument
) {}

@ObjectType()
export class DeviceMainDocument extends StatsMainDocument(DeviceSubDocument) {}

@ObjectType()
export class KeyMainDocument extends StatsMainDocument(KeySubDocument) {}
