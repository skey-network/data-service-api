import { Document, Model } from 'mongoose'
import { paginationPipeline, sortPipeline } from '../queries/standardIndex.query'
import { CommonIndexArgs } from './common.args'
import { Meta } from './common.interfaces'
import { QueryResult } from './common.interfaces'

export const runQuery = async <T extends Document, Y extends CommonIndexArgs>(
  model: Model<T>,
  args: Y,
  pipeline: any[]
): Promise<QueryResult<T>> => {
  const getCount = model.aggregate(pipeline).count('total')

  const getResults = model.aggregate([
    ...pipeline,
    ...sortPipeline(args),
    ...paginationPipeline(args)
  ])

  const [objects, count] = await Promise.all([getResults, getCount])

  const total: number = count[0]?.total ?? 0

  const meta: Meta = {
    total,
    skip: args.skip,
    take: args.take
  }

  return { objects, meta }
}