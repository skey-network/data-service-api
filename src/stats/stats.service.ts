import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { getChartData } from './chart.functions'
import { ChartArgs } from './stats.args'
import { Stats, StatsModel } from './stats.schema'

@Injectable()
export class StatsService {
  constructor(@InjectModel(Stats.name) private statsModel: StatsModel) {}

  async show(type: string, id: string) {
    const doc = await this.statsModel.findOne({ type, id })
    if (doc) return doc

    throw new NotFoundException()
  }

  async chart(type: string, args: ChartArgs) {
    const { id, ...chartInput } = args
    const doc = await this.show(type, id)

    return getChartData<any>(doc.historical ?? [], chartInput)
  }
}
