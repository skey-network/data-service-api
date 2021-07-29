export const textSearchPipeline = (search?: string) => {
  if (!search) return []

  return [
    { $match: { $text: { $search: search } } },
    { $addFields: { score: { $meta: 'textScore' } } }
  ]
}
