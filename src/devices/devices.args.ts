import { ArgsType, Field, Float } from '@nestjs/graphql'
import { IsBoolean, IsLatitude, IsLongitude, IsOptional } from 'class-validator'
import { IsBlockchainAddress } from '../common/common.decorators'
import { CommonIndexArgs } from '../common/common.args'

@ArgsType()
export class DevicesArgs extends CommonIndexArgs {
  @Field({ nullable: true })
  @IsBlockchainAddress()
  @IsOptional()
  supplier?: string

  @Field({ nullable: true })
  @IsBlockchainAddress()
  @IsOptional()
  owner?: string

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  visible?: boolean

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  connected?: boolean
}

@ArgsType()
export class DevicesByKeys extends DevicesArgs {
  @Field()
  @IsBlockchainAddress()
  address: string
}

@ArgsType()
export class DevicesGeoSearchArgs extends DevicesArgs {
  @Field(() => Float)
  @IsLatitude()
  bottomLeftLatitude: number

  @Field(() => Float)
  @IsLongitude()
  bottomLeftLongitude: number

  @Field(() => Float)
  @IsLatitude()
  upperRightLatitude: number

  @Field(() => Float)
  @IsLongitude()
  upperRightLongitude: number
}

export const DeviceFilterFields = Object.freeze([
  'supplier',
  'owner',
  'visible',
  'active',
  'connected'
])
