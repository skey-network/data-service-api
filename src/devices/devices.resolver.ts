import { Args, Query, Resolver } from '@nestjs/graphql'
import { CommonAddressArgs } from '../common/common.args'
import { DevicesArgs, DevicesByKeys } from './devices.args'
import { Device } from './devices.schema'
import { DevicesService } from './devices.service'

const devicesByKeysDescription = `
  Return list of devices to which an address has keys. For example:
  User with address user_1 is the owner of keys key_1 and key_2, key_1 is for device_1 and key_2 is for device_2.
  There are also user_2, device_3 and key_3. The method will return [device_1, device_2]. This is helpful when user
  need a list of devices he can interact with.
`

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

  @Query(() => [Device], { description: devicesByKeysDescription })
  async devicesByKeys(@Args() args: DevicesByKeys) {
    return await this.devicesService.byKeys(args)
  }
}
