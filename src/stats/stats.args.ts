import { ArgsType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ArgsType()
export class StatsArgs {
  @Field(() => String)
  @IsString()
  id: string
}
