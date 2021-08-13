import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { Paginated } from '../common/common.interfaces'

export type SupplierDocument = Supplier & Document
export type SupplierModel = Model<SupplierDocument>

@Schema()
@ObjectType()
export class Supplier {
  @Field(() => ID)
  id: string

  @Prop(String)
  @Field(() => String)
  address: string

  @Prop(Boolean)
  @Field(() => Boolean, { defaultValue: false })
  whitelisted?: boolean

  @Prop(String)
  @Field(() => String, { nullable: true })
  name?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  description?: string

  @Prop([String])
  @Field(() => [String], { defaultValue: [] })
  whitelist?: string[]

  @Prop([String])
  @Field(() => [String], { defaultValue: [] })
  organisations?: string[]

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
export class PaginatedSuppliers extends Paginated(Supplier) {}

export const SupplierSchema = SchemaFactory.createForClass(Supplier)
