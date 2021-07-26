import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Device, DeviceSchema } from './devices.schema'
import { DevicesResolver } from './devices.resolver'
import { DevicesService } from './devices.service'
import { Key, KeySchema } from '../keys/keys.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: Key.name, schema: KeySchema }])
  ],
  providers: [DevicesResolver, DevicesService]
})
export class DevicesModule {}
