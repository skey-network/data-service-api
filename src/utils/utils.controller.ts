import { Controller, OnApplicationBootstrap } from '@nestjs/common'
import { indexesConfigs } from './index.config'
import { IndexService } from './index.service'

@Controller('utils')
export class UtilsController implements OnApplicationBootstrap {
  constructor(private indexService: IndexService) {}

  async onApplicationBootstrap() {
    await this.indexService.handleIndexes(indexesConfigs)
  }
}
