import { ArgsType, Field } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { IsBlockchainAddress, IsBlockchainTxHash } from 'src/common/decorators'
import { CommonIndexArgs } from '../common/common.args'

@ArgsType()
export class KeysArgs extends CommonIndexArgs {
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
