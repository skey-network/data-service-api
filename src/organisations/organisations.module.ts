import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Organisation, OrganisationSchema } from './organisations.schema'
import { OrganisationsResolver } from './organisations.resolver'
import { OrganisationsService } from './organisations.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organisation.name, schema: OrganisationSchema }
    ])
  ],
  providers: [OrganisationsResolver, OrganisationsService]
})
export class OrganisationsModule {}
