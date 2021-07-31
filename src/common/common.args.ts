import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, Matches, Max, Min, MinLength } from 'class-validator'
import config from '../config'
import { IsBlockchainAddress } from './common.decorators'

export const skipDescription = `
  Used for pagination. Indicates how many records starting from the first one should be skipped.
  For example, { skip: 20, take: 10 } equals 3 page and 10 items for each page.
`

export const takeDescription = `
  Used for pagination. Indicates how many records should be returned in the current request.
  For example, { skip: 20, take: 10 } equals 3 page and 10 items for each page. Default value
  is ${config().app.defaultPaginationLimit}. Maximum amount is ${
  config().app.maxPaginationLimit
}
`

export const orderDescription = `
  Order in which records will be sorted. Correct values are "asc" for ascending and "desc"
  for descending
`

export const orderByDescription = `
  Field name used for sorting. For example { order: "desc", orderBy: "updatedAt" } returns 
  last updated items first.
`

export const searchDescription = `
  User to search for match in multiple fields. It appends new field (score) to returned items.
  For example query devices { search: "teltonika", order: "desc", orderby: "score" } returns devices that have
  "teltonika" string in one of the fields and places best matches first.
`

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { description: skipDescription })
  @Min(0)
  skip = 0

  @Field(() => Int, { description: takeDescription })
  @Min(1)
  @Max(config().app.maxPaginationLimit)
  take = config().app.defaultPaginationLimit
}

@ArgsType()
export class CommonIndexArgs extends PaginationArgs {
  @Field(() => String, { description: orderDescription })
  @Matches(/asc|desc/)
  order: 'asc' | 'desc' = 'asc'

  @Field(() => String, { nullable: true, description: orderByDescription })
  @IsString()
  @IsOptional()
  orderBy?: string

  @Field(() => String, { nullable: true, description: searchDescription })
  @IsString()
  @IsOptional()
  @MinLength(3)
  search?: string
}

@ArgsType()
export class CommonAddressArgs {
  @Field(() => String)
  @IsBlockchainAddress()
  address: string
}
