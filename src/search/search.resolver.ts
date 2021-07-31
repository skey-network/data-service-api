import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchArgs } from './search.args'
import { SearchResults } from './search.schema'
import { SearchService } from './search.service'

@Resolver(() => SearchResults)
export class SearchResolver {
  constructor(private searchService: SearchService) {}

  @Query(() => SearchResults)
  async search(@Args() args: SearchArgs) {
    return await this.searchService.search(args)
  }
}
