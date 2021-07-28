import { GeoSearchInput } from '../devices/devices.args'

export const geoSearchPipeline = (input?: GeoSearchInput) => {
  if (!input) return []

  return [
    { $addFields: { location: { type: 'Point', coordinates: ['$lng', '$lat'] } } },
    {
      $match: {
        location: {
          $geoWithin: {
            $box: [
              [input.bottomLeft.lng, input.bottomLeft.lat],
              [input.upperRight.lng, input.upperRight.lat]
            ]
          }
        }
      }
    }
  ]
}
