import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { standardIndexPipeline } from 'src/queries/standardIndex.query'
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

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: DeviceModel,
    @InjectModel(Key.name) private keyModel: KeyModel
  ) {}

  async findAll(args: DevicesArgs) {
    const pipeline = standardIndexPipeline(args, DeviceFilterFields)

    return await this.deviceModel.aggregate(pipeline)
  }

  async findOne(args: CommonAddressArgs) {
    const device = await this.deviceModel.findOne({ address: args.address })
    if (!device) throw new NotFoundException()

    return device
  }

  async byKeys(args: DevicesByKeys) {
    const pipeline = [
      ...forKeysOwnerPipeline(args.address),
      ...standardIndexPipeline(args, DeviceFilterFields)
    ]

    return await this.keyModel.aggregate(pipeline)
  }

  async devicesGeoSearch(args: DevicesGeoSearchArgs) {
    const pipeline = [
      ...geoSearchPipeline(args),
      ...standardIndexPipeline(args, DeviceFilterFields)
    ]

    return await this.deviceModel.aggregate(pipeline)
  }
}
