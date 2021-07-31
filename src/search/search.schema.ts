import { Field, ObjectType } from '@nestjs/graphql'
import { Meta } from '../common/common.interfaces'
import { Device } from '../devices/devices.schema'
import { Event } from '../events/events.schema'
import { Key } from '../keys/keys.schema'
import { Organisation } from '../organisations/organisations.schema'
import { Supplier } from '../suppliers/suppliers.schema'

export const collections = Object.freeze([
  'devices',
  'events',
  'keys',
  'organisations',
  'suppliers'
])

@ObjectType()
export class SearchResults {
  @Field(() => [Device], { defaultValue: [] })
  devices: Device[]

  @Field(() => [Event], { defaultValue: [] })
  events: Event[]

  @Field(() => [Key], { defaultValue: [] })
  keys: Key[]

  @Field(() => [Organisation], { defaultValue: [] })
  organisations: Organisation[]

  @Field(() => [Supplier], { defaultValue: [] })
  suppliers: Supplier[]

  @Field(() => Meta)
  meta: Meta
}
