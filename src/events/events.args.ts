import { ArgsType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { IsBlockchainAddress, IsBlockchainTxHash } from 'src/common/decorators'
import { CommonIndexArgs } from '../common/common.args'

@ArgsType()
export class EventsArgs extends CommonIndexArgs {
  @Field({ nullable: true })
  @IsBlockchainAddress()
  @IsOptional()
  sender?: string

  @Field({ nullable: true })
  @IsBlockchainAddress()
  @IsOptional()
  device?: string

  @Field({ nullable: true })
  @IsBlockchainTxHash()
  @IsOptional()
  assetId?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  action?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string
}

@ArgsType()
export class EventArgs {
  @Field()
  @IsBlockchainTxHash()
  txHash: string
}

export const EventFilterFields = Object.freeze([
  'sender',
  'device',
  'assetId',
  'action',
  'status'
])
