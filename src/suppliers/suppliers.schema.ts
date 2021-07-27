import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/common/common.interfaces'

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
  devices?: string[]

  @Prop(Date)
  @Field(() => Date)
  createdAt: Date

  @Prop(Date)
  @Field(() => Date)
  updatedAt: Date
}

@ObjectType()
export class PaginatedSuppliers extends Paginated(Supplier) {}

export const SupplierSchema = SchemaFactory.createForClass(Supplier)
