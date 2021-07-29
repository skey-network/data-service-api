import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { Paginated } from '../common/common.interfaces'

export type OrganisationDocument = Organisation & Document
export type OrganisationModel = Model<OrganisationDocument>

@Schema()
@ObjectType()
export class Organisation {
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
  users: string[]

  @Prop(Date)
  @Field(() => Date)
  createdAt: Date

  @Prop(Date)
  @Field(() => Date)
  updatedAt: Date

  // ==============================
  // GRAPHQL ONLY
  // ==============================

  @Field(() => Float, { nullable: true })
  score?: number
}

@ObjectType()
export class PaginatedOrganisations extends Paginated(Organisation) {}

export const OrganisationSchema = SchemaFactory.createForClass(Organisation)
