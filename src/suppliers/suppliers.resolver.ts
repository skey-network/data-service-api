import { Args, Query, Resolver } from '@nestjs/graphql'
import { CommonAddressArgs } from '../common/common.args'
import { SuppliersArgs } from './suppliers.args'
import { Supplier, PaginatedSuppliers } from './suppliers.schema'
import { SuppliersService } from './suppliers.service'

@Resolver(() => Supplier)
export class SuppliersResolver {
  constructor(private suppliersService: SuppliersService) {}

  @Query(() => PaginatedSuppliers)
  async suppliers(@Args() args: SuppliersArgs) {
    return await this.suppliersService.findAll(args)
  }

  @Query(() => Supplier)
  async supplier(@Args() args: CommonAddressArgs) {
    return await this.suppliersService.findOne(args)
  }
}
