import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'
import { Field, ID, ObjectType } from '@nestjs/graphql'

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
}

export const OrganisationSchema = SchemaFactory.createForClass(Organisation)
