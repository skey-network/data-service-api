import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { IsBlockchainAddress, IsBlockchainTxHash } from '../common/common.decorators'
import { CommonIndexArgs } from '../common/common.args'

@InputType()
export class EventsFilter {
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
export class EventsArgs extends CommonIndexArgs {
  @Field(() => EventsFilter, { defaultValue: {} })
  @ValidateNested()
  filter: EventsFilter
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
