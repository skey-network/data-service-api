import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { filterPipeline } from '../queries/standardIndex.query'
import { Key, KeyModel } from './keys.schema'
import { KeysArgs, KeyFilterFields, KeyArgs } from './keys.args'
import { runQuery } from '../common/common.functions'
import {
  whitelistedProp,
  WhitelistedPropInput
} from '../queries/whitelistedProp.query'

export const keysWhitelistedPropInput: WhitelistedPropInput = {
  localId: 'assetId',
  lookupCollection: 'devices',
  localField: 'device',
  foreignField: 'address',
  foreignArray: 'whitelist',
  newFieldName: 'whitelisted'
}

@Injectable()
export class KeysService {
  constructor(@InjectModel(Key.name) private keyModel: KeyModel) {}

  async findAll(args: KeysArgs) {
    const pipeline = [
      ...filterPipeline(args.filter, KeyFilterFields),
      ...whitelistedProp(keysWhitelistedPropInput)
    ]

    return runQuery(this.keyModel, args, pipeline)
  }

  async findOne(args: KeyArgs) {
    const key = await this.keyModel.findOne({ assetId: args.assetId })
    if (!key) throw new NotFoundException()

    return key
  }
}
