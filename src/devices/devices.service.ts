import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { standardIndexPipeline } from 'src/common/query'
import { CommonAddressArgs } from '../common/common.args'
import { Device, DeviceModel } from './devices.schema'
import { DevicesArgs, DeviceFilterFields } from './devices.args'

@Injectable()
export class DevicesService {
  constructor(@InjectModel(Device.name) private deviceModel: DeviceModel) {}

  async findAll(args: DevicesArgs) {
    const pipeline = standardIndexPipeline(args, DeviceFilterFields)

    return await this.deviceModel.aggregate(pipeline)
  }

  async findOne(args: CommonAddressArgs) {
    const device = await this.deviceModel.findOne({ address: args.address })
    if (!device) throw new NotFoundException()

    return device
  }
}
