import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator'
import { IsBlockchainAddress, IsBlockchainTxHash } from '../common/common.decorators'
import { CommonIndexArgs } from '../common/common.args'

const deviceWhitelistedDescription = `\
Filter keys by supplier device whitelist. For example, if set to true, this will\
return only keys for devices that are whitelisted by their suppliers. If set to false,\
it will return only keys for devices that are not whitelisted by their suppliers.\
If not given, it's not filtered at all.\
`

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

  @Field({ nullable: true, description: deviceWhitelistedDescription })
  @IsBoolean()
  @IsOptional()
  deviceWhitelisted?: boolean
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
  'burned',
  'deviceWhitelisted'
])
