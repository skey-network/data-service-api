import { ArgsType, Field } from '@nestjs/graphql'
import { CommonIndexArgs } from '../common/common.args'
import { IsBoolean, IsOptional } from 'class-validator'

@ArgsType()
export class SuppliersArgs extends CommonIndexArgs {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  whitelisted?: boolean
}

export const SupplierFilterFields = Object.freeze(['whitelisted'])
