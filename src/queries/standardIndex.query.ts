import { CommonIndexArgs } from '../common/common.args'

export interface FilterField {
  field: string
  value: any
}

export interface SortInput {
  order: 'asc' | 'desc'
  orderBy?: string
}

export const getFilterFields = <T extends any>(
  args: T,
  whitelist: readonly string[]
): FilterField[] =>
  Object.entries(args)
    .filter(
      ([key, value]) =>
        whitelist.includes(key) && value !== undefined && value !== null
    )
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

export const sortPipeline = <T extends SortInput>(args: T) => {
  if (!args.orderBy) return []

  const order = args.order === 'asc' ? 1 : -1

  return [{ $sort: { [args.orderBy]: order } }]
}

export const standardIndexPipeline = <T extends CommonIndexArgs>(
  args: T,
  whitelist: readonly string[]
) => [
  ...filterPipeline(args, whitelist),
  ...sortPipeline(args),
  ...paginationPipeline(args)
]
