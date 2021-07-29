import { GeoSearchInput } from '../devices/devices.args'

export const transformCoords = (input: GeoSearchInput) => {
  let x1 = input.bottomLeft.lat
  let y1 = input.bottomLeft.lng
  let x2 = input.upperRight.lat
  let y2 = input.upperRight.lng

  if (y2 < y1) {
    y2 += 360
  }

  return [
    [y1, x1],
    [y2, x2]
  ]
}

export const geoSearchPipeline = (input?: GeoSearchInput) => {
  if (!input) return []

  return [
    { $addFields: { location: { type: 'Point', coordinates: ['$lng', '$lat'] } } },
    {
      $match: {
        location: {
          $geoWithin: {
            $box: transformCoords(input)
          }
        }
      }
    }
  ]
}
