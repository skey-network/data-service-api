import { Document } from 'mongoose'
import { Type } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'

export interface QueryResult<T extends Document> {
  items: T[]
  meta: Meta
}

@ObjectType()
export class Meta {
  @Field(() => Int)
  total: number

  @Field(() => Int)
  skip: number

  @Field(() => Int)
  take: number
}

export const Paginated = <T>(classRef: Type<T>): any => {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef])
    items: T[]

    @Field(() => Meta)
    meta: Meta
  }

  return PaginatedType
}
