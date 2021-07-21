import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SupplierSchema, Supplier } from './suppliers.schema'
import { SuppliersResolver } from './suppliers.resolver'
import { SuppliersService } from './suppliers.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supplier.name, schema: SupplierSchema }])
  ],
  providers: [SuppliersResolver, SuppliersService]
})
export class SuppliersModule {}
