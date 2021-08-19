import { Args, Query, Resolver } from '@nestjs/graphql'
import { StatsArgs } from './stats.args'
import {
  DeviceMainDocument,
  KeyMainDocument,
  OrganisationMainDocument,
  SupplierMainDocument
} from './stats.schema'
import { StatsService } from './stats.service'

@Resolver()
export class StatsResolver {
  constructor(private statsService: StatsService) {}

  @Query(() => SupplierMainDocument)
  async supplierStats(@Args() args: StatsArgs) {
    return await this.statsService.show('suppliers', args.id)
  }

  @Query(() => OrganisationMainDocument)
  async organisationStats(@Args() args: StatsArgs) {
    return await this.statsService.show('organisations', args.id)
  }

  @Query(() => DeviceMainDocument)
  async deviceStats(@Args() args: StatsArgs) {
    return await this.statsService.show('devices', args.id)
  }

  @Query(() => KeyMainDocument)
  async keyStats(@Args() args: StatsArgs) {
    return await this.statsService.show('keys', args.id)
  }
}
