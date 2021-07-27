import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'
import { Field, ID, Float, ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/common/common.interfaces'

export type KeyDocument = Key & Document
export type KeyModel = Model<KeyDocument>

@Schema()
@ObjectType()
export class Key {
  @Field(() => ID)
  id: string

  @Prop(String)
  @Field(() => String)
  assetId: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  issuer?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  owner?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  name?: string

  @Prop(String)
  @Field(() => String, { nullable: true })
  device?: string

  @Prop(Number)
  @Field(() => Float, { nullable: true })
  validTo?: number

  @Prop(Number)
  @Field(() => Float, { nullable: true })
  issueTimestamp?: number

  @Prop(Boolean)
  @Field(() => Boolean, { nullable: true })
  burned?: boolean

  @Prop(Date)
  @Field(() => Date)
  createdAt: Date

  @Prop(Date)
  @Field(() => Date)
  updatedAt: Date

  // ==============================
  // GRAPHQL ONLY
  // ==============================

  @Field(() => Boolean, { nullable: true })
  whitelisted?: boolean
}

@ObjectType()
export class PaginatedKeys extends Paginated(Key) {}

export const KeySchema = SchemaFactory.createForClass(Key)
