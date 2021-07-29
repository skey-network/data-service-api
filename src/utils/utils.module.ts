import { Module } from '@nestjs/common'
import { IndexService } from './index.service'
import { UtilsController } from './utils.controller'

@Module({
  controllers: [UtilsController],
  providers: [IndexService]
})
export class UtilsModule {}
