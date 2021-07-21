import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { KeysResolver } from './keys.resolver'
import { Key, KeySchema } from './keys.schema'
import { KeysService } from './keys.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Key.name, schema: KeySchema }])],
  providers: [KeysResolver, KeysService]
})
export class KeysModule {}
