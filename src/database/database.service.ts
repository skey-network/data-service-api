import { Injectable, NotFoundException } from '@nestjs/common'
import { Collection } from 'mongoose'
import { PaginationArgs } from '../common/common.args'
import { Meta, Pipeline } from '../common/common.interfaces'

@Injectable()
export class DatabaseService {
  async findOne(collection: Collection, idField: string, id: string) {
    const doc = await collection.findOne({ [idField]: id } as any)
    if (!doc) throw new NotFoundException()

    return doc
  }

  async query(
    collection: Collection,
    pipeline: Pipeline,
    pagination: PaginationArgs
  ) {
    const [result] = await collection
      .aggregate([...pipeline, ...this.facetPipeline(pagination)])
      .toArray()

    const { objects } = result
    const total = result?.total[0]?.total ?? 0

    const meta: Meta = {
      total,
      skip: pagination.skip,
      take: pagination.take
    }

    return { objects: objects ?? [], meta }
  }

  facetPipeline(args: PaginationArgs): Pipeline {
    return [
      {
        $facet: {
          objects: [{ $skip: args.skip }, { $limit: args.take }],
          total: [{ $count: 'total' }]
        }
      }
    ]
  }
}
