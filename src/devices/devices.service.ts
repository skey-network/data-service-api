import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { filterPipeline } from '../queries/standardIndex.query'
import { CommonAddressArgs } from '../common/common.args'
import { Device, DeviceModel } from './devices.schema'
import { DevicesArgs, DeviceFilterFields } from './devices.args'
import { keysOwnerPipeline } from '../queries/devicesByKeys.query'
import { geoSearchPipeline } from '../queries/geoSearch.query'
import { getItem, runQuery } from '../common/common.functions'
import {
  whitelistedProp,
  WhitelistedPropInput
} from '../queries/whitelistedProp.query'

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
  constructor(@InjectModel(Device.name) private deviceModel: DeviceModel) {}

  async findAll(args: DevicesArgs) {
    const pipeline = [
      ...keysOwnerPipeline(args.keysOwner),
      ...whitelistedProp(devicesWhitelistedPropInput),
      ...filterPipeline(args.filter, DeviceFilterFields),
      ...geoSearchPipeline(args.geoSearch)
    ]

    return await runQuery(this.deviceModel, args, pipeline)
  }

  async findOne(args: CommonAddressArgs) {
    return await getItem(this.deviceModel, 'address', args.address)
  }
}
