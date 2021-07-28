import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { CommonIndexArgs } from '../common/common.args'
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator'

@InputType()
export class SuppliersFilter {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  whitelisted?: boolean
}

@ArgsType()
export class SuppliersArgs extends CommonIndexArgs {
  @Field(() => SuppliersFilter, { defaultValue: {} })
  @ValidateNested()
  filter: SuppliersFilter
}

export const SupplierFilterFields = Object.freeze(['whitelisted'])
