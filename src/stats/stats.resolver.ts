import { Args, Query, Resolver } from '@nestjs/graphql'
import { ChartArgs, StatsArgs } from './stats.args'
import {
  DeviceMainDocument,
  KeyMainDocument,
  OrganisationMainDocument,
  SupplierMainDocument,
  DeviceChartDocument,
  KeyChartDocument,
  OrganisationChartDocument,
  SupplierChartDocument
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

  @Query(() => [SupplierChartDocument])
  async supplierChart(@Args() args: ChartArgs) {
    return await this.statsService.chart('suppliers', args)
  }

  @Query(() => [OrganisationChartDocument])
  async organisationChart(@Args() args: ChartArgs) {
    return await this.statsService.chart('organisations', args)
  }

  @Query(() => [DeviceChartDocument])
  async deviceChart(@Args() args: ChartArgs) {
    return await this.statsService.chart('devices', args)
  }

  @Query(() => [KeyChartDocument])
  async keyChart(@Args() args: ChartArgs) {
    return await this.statsService.chart('keys', args)
  }
}
