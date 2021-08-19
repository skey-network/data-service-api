import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { StatsResolver } from './stats.resolver'
import { Stats, StatsSchema } from './stats.schema'
import { StatsService } from './stats.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Stats.name, schema: StatsSchema }])],
  providers: [StatsService, StatsResolver]
})
export class StatsModule {}
