import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  filterPipeline,
  standardIndexPipeline
} from 'src/queries/standardIndex.query'
import { CommonAddressArgs } from '../common/common.args'
import { Device, DeviceModel } from './devices.schema'
import { Key, KeyModel } from '../keys/keys.schema'
import {
  DevicesArgs,
  DeviceFilterFields,
  DevicesByKeys,
  DevicesGeoSearchArgs
} from './devices.args'
import { forKeysOwnerPipeline } from '../queries/devicesByKeys.query'
import { geoSearchPipeline } from 'src/queries/geoSearch.query'
import { runQuery } from 'src/common/common.functions'

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: DeviceModel,
    @InjectModel(Key.name) private keyModel: KeyModel
  ) {}

  async findAll(args: DevicesArgs) {
    const pipeline = filterPipeline(args, DeviceFilterFields)

    return await runQuery(this.deviceModel, args, pipeline)
  }

  async findOne(args: CommonAddressArgs) {
    const device = await this.deviceModel.findOne({ address: args.address })
    if (!device) throw new NotFoundException()

    return device
  }

  async byKeys(args: DevicesByKeys) {
    const pipeline = [
      ...forKeysOwnerPipeline(args.address),
      ...filterPipeline(args, DeviceFilterFields)
    ]

    return await runQuery(this.keyModel, args, pipeline)
  }

  async devicesGeoSearch(args: DevicesGeoSearchArgs) {
    const pipeline = [
      ...geoSearchPipeline(args),
      ...filterPipeline(args, DeviceFilterFields)
    ]

    return await runQuery(this.deviceModel, args, pipeline)
  }
}
