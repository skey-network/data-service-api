import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator'
import { CommonIndexArgs } from '../common/common.args'

@InputType()
export class OrganisationsFilter {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  whitelisted?: boolean
}

@ArgsType()
export class OrganisationsArgs extends CommonIndexArgs {
  @Field(() => OrganisationsFilter, { defaultValue: {} })
  @ValidateNested()
  filter: OrganisationsFilter
}

export const OrganisationFilterFields = Object.freeze(['whitelisted'])
