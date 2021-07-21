import { Args, Query, Resolver } from '@nestjs/graphql'
import { CommonAddressArgs } from '../common/common.args'
import { DevicesArgs } from './devices.args'
import { Device } from './devices.schema'
import { DevicesService } from './devices.service'

@Resolver(() => Device)
export class DevicesResolver {
  constructor(private devicesService: DevicesService) {}

  @Query(() => [Device])
  async devices(@Args() args: DevicesArgs) {
    return await this.devicesService.findAll(args)
  }

  @Query(() => Device)
  async device(@Args() args: CommonAddressArgs) {
    return await this.devicesService.findOne(args)
  }
}
