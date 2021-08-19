import { Injectable, NotFoundException } from '@nestjs/common'
import { Collection } from 'mongoose'
import { PaginationArgs } from '../common/common.args'
import { Meta, Pipeline } from '../common/common.interfaces'

@Injectable()
export class DatabaseService {
  async findOne(
    collection: Collection,
    idField: string,
    id: string,
    pipeline?: Pipeline
  ) {
    if (pipeline) {
      return await this.findOneByAggregation(collection, idField, id, pipeline)
    }

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

  private async findOneByAggregation(
    collection: Collection,
    idField: string,
    id: string,
    pipeline: Pipeline
  ) {
    const result = await collection
      .aggregate([...this.findOnePipeline(idField, id), ...pipeline])
      .toArray()

    if (result.length === 0) {
      throw new NotFoundException()
    }

    return result[0]
  }

  private findOnePipeline(idField: string, id: string): Pipeline {
    return [{ $match: { [idField]: id } }, { $limit: 1 }]
  }
}
