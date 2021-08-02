import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { Paginated } from '../common/common.interfaces'

export type DeviceDocument = Device & Document
export type DeviceModel = Model<DeviceDocument>

export type DeviceType =
  | 'car barrier'
  | 'human barrier'
  | 'elevator'
  | 'human'
  | 'mobile'
  | 'other'

@Schema()
@ObjectType()
export class PhysicalAddress {
  @Prop(String)
  @Field(() => String, { nullable: true })
  addressLine1?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  addressLine2?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  city?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  postcode?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  state?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  country?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  number?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  floor?: string
}

@Schema()
@ObjectType()
export class Details {
  @Prop(String)
  @Field(() => String, { nullable: true })
  deviceType?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  deviceModel?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  additionalDescription?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  assetUrl?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  url?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  contactInfo?: string

  @Prop(PhysicalAddress)
  @Field(() => PhysicalAddress, { nullable: true })
  physicalAddress?: PhysicalAddress
}

@Schema()
@ObjectType()
export class Device {
  @Field(() => ID)
  id: string

  // ==============================
  // ADDRESSES
  // ==============================

  @Prop(String)
  @Field(() => String)
  address: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  supplier?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  owner?: string

  // ==============================
  // BASIC INFO
  // ==============================

  @Prop(String)
  @Field(() => String, { nullable: true })
  name?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  description?: string

  // ==============================
  // LOCATION
  // ==============================

  @Prop(Number)
  @Field(() => Number, { nullable: true })
  lat?: number

  @Prop(Number)
  @Field(() => Number, { nullable: true })
  lng?: number

  @Prop(Number)
  @Field(() => Number, { nullable: true })
  alt?: number

  // ==============================
  // BOOLEANS
  // ==============================

  @Prop(Boolean)
  @Field(() => Boolean, { nullable: true })
  visible?: boolean

  @Prop(Boolean)
  @Field(() => Boolean, { nullable: true })
  active?: boolean

  @Prop(Boolean)
  @Field(() => Boolean, { nullable: true })
  connected?: boolean

  // ==============================
  // ADDITIONAL INFO
  // ==============================

  @Prop(Details)
  @Field(() => Details, { nullable: true })
  details?: Details

  // ==============================
  // CUSTOM DATA
  // ==============================

  @Prop(String)
  @Field(() => String, { nullable: true })
  custom?: string

  // ==============================
  // KEYS
  // ==============================

  @Prop([String])
  @Field(() => [String], { defaultValue: [] })
  whitelist?: string[]

  // ==============================
  // TIMESTAMPS
  // ==============================

  @Prop(Date)
  @Field(() => Date, { nullable: true })
  createdAt: Date

  @Prop(Date)
  @Field(() => Date, { nullable: true })
  updatedAt: Date

  // ==============================
  // GRAPHQL ONLY
  // ==============================

  @Field(() => Boolean, { nullable: true })
  whitelisted?: boolean

  @Field(() => Float, { nullable: true })
  score?: number
}

@ObjectType()
export class PaginatedDevices extends Paginated(Device) {}

export const DeviceSchema = SchemaFactory.createForClass(Device)
