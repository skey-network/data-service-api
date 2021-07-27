import { Args, Query, Resolver } from '@nestjs/graphql'
import { CommonAddressArgs } from '../common/common.args'
import { DevicesArgs, DevicesByKeys, DevicesGeoSearchArgs } from './devices.args'
import { Device, PaginatedDevices } from './devices.schema'
import { DevicesService } from './devices.service'

const devicesByKeysDescription = `
  Returns list of devices to which an address has keys. For example, User with address user_1 is
  the owner of keys key_1 and key_2, key_1 is for device_1 and key_2 is for device_2. There are
  also user_2, device_3 and key_3. The method will return [device_1, device_2]. This is helpful
  when user need a list of devices he can interact with.
`

const devicesGeoSearchDescription = `
  Retruns list of devices that are inside of selected rectangle. For example, for points [lat:49, lng: 16]
  as bottomLeft and [lat:54, lng:24] as upperRight, it's going to return all devices in Poland.
`

@Resolver(() => Device)
export class DevicesResolver {
  constructor(private devicesService: DevicesService) {}

  @Query(() => PaginatedDevices)
  async devices(@Args() args: DevicesArgs) {
    return await this.devicesService.findAll(args)
  }

  @Query(() => Device)
  async device(@Args() args: CommonAddressArgs) {
    return await this.devicesService.findOne(args)
  }

  @Query(() => PaginatedDevices, { description: devicesByKeysDescription })
  async devicesByKeys(@Args() args: DevicesByKeys) {
    return await this.devicesService.byKeys(args)
  }
  @Query(() => PaginatedDevices, { description: devicesGeoSearchDescription })
  async devicesGeoSearch(@Args() args: DevicesGeoSearchArgs) {
    return await this.devicesService.devicesGeoSearch(args)
  }
}
