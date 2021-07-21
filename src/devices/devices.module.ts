import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Device, DeviceSchema } from './devices.schema'
import { DevicesResolver } from './devices.resolver'
import { DevicesService } from './devices.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }])
  ],
  providers: [DevicesResolver, DevicesService]
})
export class DevicesModule {}
