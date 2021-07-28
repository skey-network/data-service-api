import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator'
import { IsBlockchainAddress, IsBlockchainTxHash } from '../common/common.decorators'
import { CommonIndexArgs } from '../common/common.args'

@InputType()
export class KeysFilter {
  @Field({ nullable: true })
  @IsBlockchainAddress()
  @IsOptional()
  issuer?: string

  @Field({ nullable: true })
  @IsBlockchainAddress()
  @IsOptional()
  owner?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string

  @Field({ nullable: true })
  @IsBlockchainAddress()
  @IsOptional()
  device?: string

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  burned?: boolean
}

@ArgsType()
export class KeysArgs extends CommonIndexArgs {
  @Field(() => KeysFilter, { defaultValue: {} })
  @ValidateNested()
  filter: KeysFilter
}

@ArgsType()
export class KeyArgs {
  @Field()
  @IsBlockchainTxHash()
  assetId: string
}

export const KeyFilterFields = Object.freeze([
  'issuer',
  'owner',
  'name',
  'device',
  'burned'
])
