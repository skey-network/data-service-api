import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommonAddressArgs } from '../common/common.args'
import { Supplier, SupplierModel } from './suppliers.schema'
import { SuppliersArgs, SupplierFilterFields } from './suppliers.args'
import { filterPipeline } from '../queries/standardIndex.query'
import { getItem, runQuery } from '../common/common.functions'
import { textSearchPipeline } from '../queries/textSearch.query'

@Injectable()
export class SuppliersService {
  constructor(@InjectModel(Supplier.name) private supplierModel: SupplierModel) {}

  async findAll(args: SuppliersArgs) {
    const pipeline = [
      ...textSearchPipeline(args.search),
      ...filterPipeline(args.filter, SupplierFilterFields)
    ]

    return await runQuery(this.supplierModel, args, pipeline)
  }

  async findOne(args: CommonAddressArgs) {
    return await getItem(this.supplierModel, 'address', args.address)
  }
}
