import { KeysArgs } from 'src/keys/keys.args'

export const appendDeviceWhitelisted = (args: KeysArgs) => {
  const filter = args.filter.deviceWhitelisted

  // return if value is nullable
  if (filter !== true && filter !== false) return []

  return [
    {
      $lookup: {
        from: 'suppliers',
        localField: 'issuer',
        foreignField: 'address',
        as: 'suppliersTMP'
      }
    },
    {
      $addFields: {
        devicesWhitelistTMP: { $first: '$suppliersTMP.whitelist' }
      }
    },
    {
      $addFields: {
        devicesWhitelistTMP: { $ifNull: ['$devicesWhitelistTMP', []] }
      }
    },
    {
      $addFields: {
        deviceWhitelisted: { $in: ['$device', '$devicesWhitelistTMP'] }
      }
    },
    { $unset: 'suppliersTMP' },
    { $unset: 'supplier' },
    { $unset: 'devicesWhitelistTMP' }
  ]
}
