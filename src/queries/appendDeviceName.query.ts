export const appendDeviceName = () => {
  const TMP_FIELD = 'deviceTmp'
  const OUTPUT_FIELD = 'deviceName'

  return [
    {
      $lookup: {
        from: 'devices',
        localField: 'device',
        foreignField: 'address',
        as: TMP_FIELD
      }
    },
    {
      $addFields: {
        [OUTPUT_FIELD]: { $first: `$${TMP_FIELD}.name` }
      }
    },
    {
      $unset: TMP_FIELD
    }
  ]
}
