import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, Matches, Max, Min, MinLength } from 'class-validator'
import config from '../config'
import { IsBlockchainAddress } from './common.decorators'

@ArgsType()
export class CommonIndexArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0

  @Field(() => Int)
  @Min(1)
  @Max(config().app.maxPaginationLimit)
  take = config().app.defaultPaginationLimit

  @Field()
  @Matches(/asc|desc/)
  order: 'asc' | 'desc' = 'asc'

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  orderBy?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(3)
  search?: string
}

@ArgsType()
export class CommonAddressArgs {
  @Field()
  @IsBlockchainAddress()
  address: string
}
