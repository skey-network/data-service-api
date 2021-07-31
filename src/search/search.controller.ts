import { Controller, OnApplicationBootstrap } from '@nestjs/common'
import { SearchService } from './search.service'

@Controller()
export class SearchController implements OnApplicationBootstrap {
  constructor(private searchService: SearchService) {}

  async onApplicationBootstrap() {
    await this.searchService.assertPlaceholder()
  }
}
