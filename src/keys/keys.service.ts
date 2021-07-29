import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { filterPipeline } from '../queries/standardIndex.query'
import { Key, KeyModel } from './keys.schema'
import { KeysArgs, KeyFilterFields, KeyArgs } from './keys.args'
import { getItem, runQuery } from '../common/common.functions'
import {
  whitelistedProp,
  WhitelistedPropInput
} from '../queries/whitelistedProp.query'
import { textSearchPipeline } from '../queries/textSearch.query'

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
      ...textSearchPipeline(args.search),
      ...whitelistedProp(keysWhitelistedPropInput),
      ...filterPipeline(args.filter, KeyFilterFields)
    ]

    return runQuery(this.keyModel, args, pipeline)
  }

  async findOne(args: KeyArgs) {
    return await getItem(this.keyModel, 'assetId', args.assetId)
  }
}
