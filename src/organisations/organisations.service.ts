import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommonAddressArgs } from '../common/common.args'
import { Organisation, OrganisationModel } from './organisations.schema'
import { OrganisationsArgs, OrganisationFilterFields } from './organisations.args'
import { filterPipeline } from '../queries/standardIndex.query'
import { textSearchPipeline } from '../queries/textSearch.query'
import { sortPipeline } from '../queries/standardIndex.query'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectModel(Organisation.name) private organisationModel: OrganisationModel,
    private databaseService: DatabaseService
  ) {}

  async findAll(args: OrganisationsArgs) {
    const pipeline = [
      ...textSearchPipeline(args.search),
      ...filterPipeline(args.filter, OrganisationFilterFields),
      ...sortPipeline(args)
    ]

    return await this.databaseService.query(
      this.organisationModel.collection,
      pipeline,
      args
    )
  }

  async findOne(args: CommonAddressArgs) {
    return await this.databaseService.findOne(
      this.organisationModel.collection,
      'address',
      args.address
    )
  }
}
