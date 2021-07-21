import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { indexQuery } from '../common/query'
import { Key, KeyModel } from './keys.schema'
import { KeysArgs, KeyFilterFields, KeyArgs } from './keys.args'

@Injectable()
export class KeysService {
  constructor(@InjectModel(Key.name) private keyModel: KeyModel) {}

  async findAll(args: KeysArgs) {
    return await indexQuery(this.keyModel, KeyFilterFields, args)
  }

  async findOne(args: KeyArgs) {
    const key = await this.keyModel.findOne({ assetId: args.assetId })
    if (!key) throw new NotFoundException()

    return key
  }
}
