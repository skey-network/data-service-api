export const forKeysOwnerPipeline = (owner: string) => [
  { $match: { owner } },
  { $project: { _id: 0, key: '$$ROOT' } },
  {
    $lookup: {
      from: 'devices',
      localField: 'key.device',
      foreignField: 'address',
      as: 'devices'
    }
  },
  { $unwind: { path: '$devices', preserveNullAndEmptyArrays: false } },
  { $group: { _id: '$devices', keys: { $addToSet: '$key' } } },
  { $addFields: { '_id.keys': '$keys' } },
  { $replaceRoot: { newRoot: '$_id' } }
]
