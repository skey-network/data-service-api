import { Document } from 'mongoose'
import { Type } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'

export type Pipeline = any[]

export interface QueryResult<T extends Document> {
  objects: T[]
  meta: Meta
}

@ObjectType()
export class Meta {
  @Field(() => Int, { nullable: true })
  total: number

  @Field(() => Int, { nullable: true })
  skip: number

  @Field(() => Int, { nullable: true })
  take: number
}

export const Paginated = <T>(classRef: Type<T>): any => {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef])
    objects: T[]

    @Field(() => Meta)
    meta: Meta
  }

  return PaginatedType
}
