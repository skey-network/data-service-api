export interface WhitelistedPropInput {
  localId: string
  lookupCollection: string
  localField: string
  foreignField: string
  foreignArray: string
  newFieldName: string
}

// example input {
//   localId: assetId
//   lookupCollection: devices
//   localField: device
//   foreignField: address
//   foreignArray: whitelist
//   newFieldName: whitelisted
// }

export const whitelistedProp = (input: WhitelistedPropInput) => {
  const LOOKUP_DOC = 'lookupDocTmp'
  const LOOKUP_ARR = 'lookupArrTmp'

  return [
    {
      $lookup: {
        from: input.lookupCollection,
        localField: input.localField,
        foreignField: input.foreignField,
        as: LOOKUP_DOC
      }
    },
    {
      $addFields: {
        [LOOKUP_ARR]: { $first: `$${LOOKUP_DOC}.${input.foreignArray}` }
      }
    },
    { $unset: LOOKUP_DOC },
    {
      $addFields: {
        [LOOKUP_ARR]: { $ifNull: [`$${LOOKUP_ARR}`, []] }
      }
    },
    {
      $addFields: {
        [input.newFieldName]: { $in: [`$${input.localId}`, `$${LOOKUP_ARR}`] }
      }
    },
    { $unset: LOOKUP_ARR }
  ]
}
