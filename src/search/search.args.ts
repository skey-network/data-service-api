import { ArgsType, Field } from '@nestjs/graphql'
import { MinLength } from 'class-validator'
import { PaginationArgs } from '../common/common.args'

@ArgsType()
export class SearchArgs extends PaginationArgs {
  @Field(() => String)
  @MinLength(3)
  input: string
}
