import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { filterPipeline } from '../queries/standardIndex.query'
import { Key, KeyModel } from './keys.schema'
import { KeysArgs, KeyFilterFields, KeyArgs } from './keys.args'
import {
  whitelistedProp,
  WhitelistedPropInput
} from '../queries/whitelistedProp.query'
import { textSearchPipeline } from '../queries/textSearch.query'
import { sortPipeline } from '../queries/standardIndex.query'
import { DatabaseService } from '../database/database.service'
import { appendDeviceName } from '../queries/appendDeviceName.query'
import { appendDeviceWhitelisted } from '../queries/appendDeviceWhitelisted.query'

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
  constructor(
    @InjectModel(Key.name) private keyModel: KeyModel,
    private databaseService: DatabaseService
  ) {}

  async findAll(args: KeysArgs) {
    const pipeline = [
      ...textSearchPipeline(args.search),
      ...whitelistedProp(keysWhitelistedPropInput),
      ...appendDeviceWhitelisted(args),
      ...filterPipeline(args.filter, KeyFilterFields),
      ...appendDeviceName(),
      ...sortPipeline(args)
    ]

    return this.databaseService.query(this.keyModel.collection, pipeline, args)
  }

  async findOne(args: KeyArgs) {
    return await this.databaseService.findOne(
      this.keyModel.collection,
      'assetId',
      args.assetId,
      [...whitelistedProp(keysWhitelistedPropInput), ...appendDeviceName()]
    )
  }
}
