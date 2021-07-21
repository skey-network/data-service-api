import { ArgsType, Field } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'
import { IsBlockchainAddress } from 'src/common/decorators'
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

export const DeviceFilterFields = Object.freeze([
  'supplier',
  'owner',
  'visible',
  'active',
  'connected'
])
