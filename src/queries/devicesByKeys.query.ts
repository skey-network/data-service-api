export const keysOwnerPipeline = (owner?: string) => {
  if (!owner) return []

  const KEYS_TMP = 'keysTmp'
  const OWNERS_TMP = 'ownersTmp'

  return [
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
}
