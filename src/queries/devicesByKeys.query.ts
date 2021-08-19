export const keysOwnerPipeline = (owner?: string, includeRemoved?: boolean) => {
  if (!owner) return []

  const KEYS_TMP = 'keysTmp'
  const OWNERS_TMP = 'ownersTmp'

  let query: any[] = [
    {
      $lookup: {
        from: 'keys',
        localField: 'address',
        foreignField: 'device',
        as: KEYS_TMP
      }
    },
    {
      $addFields: {
        [OWNERS_TMP]: {
          $map: { input: `$${KEYS_TMP}`, as: 'tmp', in: '$$tmp.owner' }
        }
      }
    },
    { $unset: KEYS_TMP },
    {
      $addFields: {
        [OWNERS_TMP]: { $ifNull: [`$${OWNERS_TMP}`, []] }
      }
    },
    {
      $match: {
        $expr: {
          $in: [owner, `$${OWNERS_TMP}`]
        }
      }
    },
    { $unset: OWNERS_TMP }
  ]

  if (!includeRemoved) {
    query.push({
      $match: {
        removed: {
          $ne: true
        }
      }
    })
  }

  return query
}
