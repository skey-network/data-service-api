import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommonAddressArgs } from '../common/common.args'
import { Supplier, SupplierModel } from './suppliers.schema'
import { SuppliersArgs, SupplierFilterFields } from './suppliers.args'
import { filterPipeline } from '../queries/standardIndex.query'
import { textSearchPipeline } from '../queries/textSearch.query'
import { DatabaseService } from '../database/database.service'
import { sortPipeline } from '../queries/standardIndex.query'

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: SupplierModel,
    private databaseService: DatabaseService
  ) {}

  async findAll(args: SuppliersArgs) {
    const pipeline = [
      ...textSearchPipeline(args.search),
      ...filterPipeline(args.filter, SupplierFilterFields),
      ...sortPipeline(args)
    ]

    return await this.databaseService.query(
      this.supplierModel.collection,
      pipeline,
      args
    )
  }

  async findOne(args: CommonAddressArgs) {
    return await this.databaseService.findOne(
      this.supplierModel.collection,
      'address',
      args.address
    )
  }
}
