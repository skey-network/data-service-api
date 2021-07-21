import { Model, Document } from 'mongoose'
import { CommonIndexArgs } from './common.args'

export const indexQuery = <T extends Document, Y extends CommonIndexArgs>(
  model: Model<T>,
  filterFields: readonly string[],
  args: Y
) => {
  const query = Object.entries(args)
    .filter(([key, value]) => filterFields.includes(key) && value !== undefined)
    .map(([key, value]) => ({ [key]: value }))
    .reduce((prev, acc) => ({ ...acc, ...prev }), {} as any)

  const sort = args.orderBy ? { [args.orderBy]: args.order } : undefined

  return model.find(query).sort(sort).skip(args.skip).limit(args.take)
}
