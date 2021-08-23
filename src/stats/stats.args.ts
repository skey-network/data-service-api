import { ArgsType, Field, Float, Int } from '@nestjs/graphql'
import { IsInt, IsString } from 'class-validator'

const beginFieldDescription = `\
Unix timestamp in milliseconds pointing to date when to start the chart. For example,\
to draw a monthly chart starting in January 2021 use 1609459200000
`

const nFieldDescription = `\
Number of objects to be returned for chart. For example, to draw a monthly chart, use 30.\
`

const lengthFieldDescription = `\
Amount of time in milliseconds from one time period to another.\
For example, to draw a monthly chart, use 1 day (86400000 milliseconds)
`

@ArgsType()
export class StatsArgs {
  @Field(() => String)
  @IsString()
  id: string
}

@ArgsType()
export class ChartArgs extends StatsArgs {
  @Field(() => Float, { description: beginFieldDescription })
  @IsInt()
  begin: number

  @Field(() => Int, { description: nFieldDescription })
  @IsInt()
  n: number

  @Field(() => Float, { description: lengthFieldDescription })
  @IsInt()
  length: number
}
