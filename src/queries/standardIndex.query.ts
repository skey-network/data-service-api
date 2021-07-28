import { CommonIndexArgs } from '../common/common.args'

export interface FilterField {
  field: string
  value: any
}

export const getFilterFields = <T extends any>(
  args: T,
  whitelist: readonly string[]
): FilterField[] =>
  Object.entries(args)
    .filter(([key, value]) => whitelist.includes(key) && value !== undefined)
    .map(([key, value]) => ({ field: key, value }))

export const filterPipeline = <T extends any>(
  args: T,
  whitelist: readonly string[]
) =>
  getFilterFields(args, whitelist).map((f) => ({ $match: { [f.field]: f.value } }))

export const paginationPipeline = <T extends CommonIndexArgs>(args: T) => [
  { $skip: args.skip },
  { $limit: args.take }
]

export const sortPipeline = <T extends CommonIndexArgs>(args: T) => {
  const order = args.order === 'asc' ? 1 : -1

  const doc = { $sort: { [args.orderBy]: order } }

  return args.orderBy ? [doc] : []
}

export const standardIndexPipeline = <T extends CommonIndexArgs>(
  args: T,
  whitelist: readonly string[]
) => [
  ...filterPipeline(args, whitelist),
  ...sortPipeline(args),
  ...paginationPipeline(args)
]
