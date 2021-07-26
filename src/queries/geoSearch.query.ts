import { DevicesGeoSearchArgs } from '../devices/devices.args'

export const geoSearchPipeline = (args: DevicesGeoSearchArgs) => [
  { $addFields: { location: { type: 'Point', coordinates: ['$lng', '$lat'] } } },
  {
    $match: {
      location: {
        $geoWithin: {
          $box: [
            [args.bottomLeftLongitude, args.bottomLeftLatitude],
            [args.upperRightLongitude, args.upperRightLatitude]
          ]
        }
      }
    }
  }
]
