import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Stats, StatsModel } from './stats.schema'

@Injectable()
export class StatsService {
  constructor(@InjectModel(Stats.name) private statsModel: StatsModel) {}

  async show(type: string, id: string) {
    const doc = await this.statsModel.findOne({ type, id })
    if (doc) return doc

    throw new NotFoundException()
  }
}
