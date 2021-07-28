import { Args, Query, Resolver } from '@nestjs/graphql'
import { CommonAddressArgs } from '../common/common.args'
import { OrganisationsArgs } from './organisations.args'
import { Organisation, PaginatedOrganisations } from './organisations.schema'
import { OrganisationsService } from './organisations.service'

@Resolver(() => Organisation)
export class OrganisationsResolver {
  constructor(private organisationsService: OrganisationsService) {}

  @Query(() => PaginatedOrganisations)
  async organisations(@Args() args: OrganisationsArgs) {
    return await this.organisationsService.findAll(args)
  }

  @Query(() => Organisation)
  async organisation(@Args() args: CommonAddressArgs) {
    return await this.organisationsService.findOne(args)
  }
}
