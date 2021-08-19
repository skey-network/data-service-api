export const supplierOrganisationsPipeline = (supplier: string) => {
  const suppliersTmp = 'suppliersTmp'
  const addressesTmp = 'addressesTmp'

  return [
    {
      $lookup: {
        from: 'suppliers',
        localField: 'address',
        foreignField: 'organisations',
        as: suppliersTmp
      }
    },
    {
      $addFields: {
        [addressesTmp]: {
          $map: {
            input: `$${suppliersTmp}`,
            as: 'supplier',
            in: '$$supplier.address'
          }
        }
      }
    },
    { $unset: suppliersTmp },
    {
      $unwind: `$${addressesTmp}`
    },
    {
      $match: {
        [addressesTmp]: { $eq: supplier }
      }
    },
    { $unset: addressesTmp }
  ]
}
