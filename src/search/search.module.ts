import { Module } from '@nestjs/common'
import { SearchResolver } from './search.resolver'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'

@Module({
  providers: [SearchResolver, SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
