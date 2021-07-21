import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommonAddressArgs } from '../common/common.args'
import { Organisation, OrganisationModel } from './organisations.schema'
import {
  OrganisationsArgs,
  OrganisationFilterFields
} from './organisations.args'
import { indexQuery } from '../common/query'

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectModel(Organisation.name) private organisationModel: OrganisationModel
  ) {}

  async findAll(args: OrganisationsArgs) {
    return await indexQuery(this.organisationModel, OrganisationFilterFields, args)
  }

  async findOne(args: CommonAddressArgs) {
    const organisation = await this.organisationModel.findOne({
      address: args.address
    })
    if (!organisation) throw new NotFoundException()

    return organisation
  }
}
