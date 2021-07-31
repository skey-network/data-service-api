import { textSearchPipeline } from '../queries/textSearch.query'

// https://stackoverflow.com/a/55289184/12696645

export const createLookupStage = (collection: string, search: string) => ({
  $lookup: {
    from: collection,
    pipeline: [...textSearchPipeline(search), { $addFields: { type: collection } }],
    as: collection
  }
})

export const createLookupStages = (collections: readonly string[], search: string) =>
  collections.map((collection) => createLookupStage(collection, search))

export const createConcatArray = (collections: readonly string[]) =>
  collections.map((name) => '$' + name)

export const searchPipeline = (collections: readonly string[], search: string) => [
  { $limit: 1 },
  { $project: { _id: '$$REMOVE' } },
  ...createLookupStages(collections, search),
  { $project: { union: { $concatArrays: createConcatArray(collections) } } },
  { $unwind: '$union' },
  { $replaceRoot: { newRoot: '$union' } }
]
