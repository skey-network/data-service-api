import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommonAddressArgs } from '../common/common.args'
import { Supplier, SupplierModel } from './suppliers.schema'
import { SuppliersArgs, SupplierFilterFields } from './suppliers.args'
import { filterPipeline } from 'src/queries/standardIndex.query'
import { runQuery } from 'src/common/common.functions'

@Injectable()
export class SuppliersService {
  constructor(@InjectModel(Supplier.name) private supplierModel: SupplierModel) {}

  async findAll(args: SuppliersArgs) {
    const pipeline = filterPipeline(args, SupplierFilterFields)

    return await runQuery(this.supplierModel, args, pipeline)
  }

  async findOne(args: CommonAddressArgs) {
    const supplier = await this.supplierModel.findOne({ address: args.address })
    if (!supplier) throw new NotFoundException()

    return supplier
  }
}
