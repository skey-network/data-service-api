import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { filterPipeline } from '../queries/standardIndex.query'
import { CommonAddressArgs } from '../common/common.args'
import { Device, DeviceModel } from './devices.schema'
import { DevicesArgs, DeviceFilterFields } from './devices.args'
import { keysOwnerPipeline } from '../queries/devicesByKeys.query'
import { geoSearchPipeline } from '../queries/geoSearch.query'
import {
  whitelistedProp,
  WhitelistedPropInput
} from '../queries/whitelistedProp.query'
import { textSearchPipeline } from '../queries/textSearch.query'
import { sortPipeline } from '../queries/standardIndex.query'
import { DatabaseService } from '../database/database.service'
import GeoSearchCirclePipeline from '../queries/geoSearchCircle.query'

export const devicesWhitelistedPropInput: WhitelistedPropInput = {
  localId: 'address',
  lookupCollection: 'suppliers',
  localField: 'supplier',
  foreignField: 'address',
  foreignArray: 'whitelist',
  newFieldName: 'whitelisted'
}

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: DeviceModel,
    private databaseService: DatabaseService
  ) {}

  async findAll(args: DevicesArgs) {
    const pipeline = this.buildFindAllPipeline(args)

    return await this.databaseService.query(
      this.deviceModel.collection,
      pipeline,
      args
    )
  }

  async findOne(args: CommonAddressArgs) {
    return await this.databaseService.findOne(
      this.deviceModel.collection,
      'address',
      args.address
    )
  }

  private buildFindAllPipeline(args: DevicesArgs) {
    return [
      ...GeoSearchCirclePipeline(args.geoSearchCircle),
      ...textSearchPipeline(args.search),
      ...keysOwnerPipeline(args.keysOwner, args.includeRemoved),
      ...whitelistedProp(devicesWhitelistedPropInput),
      ...filterPipeline(args.filter, DeviceFilterFields),
      ...geoSearchPipeline(args.geoSearch),
      ...sortPipeline(args)
    ]
  }
}
