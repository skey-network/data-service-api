import { ArgsType, Field } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'
import { CommonIndexArgs } from '../common/common.args'

@ArgsType()
export class OrganisationsArgs extends CommonIndexArgs {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  whitelisted?: boolean
}

export const OrganisationFilterFields = Object.freeze(['whitelisted'])
