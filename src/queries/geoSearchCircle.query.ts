import { Pipeline } from 'src/common/common.interfaces'
import { GeoSearchCircleInput } from '../devices/devices.args'

const EARTH_RADIUS_IN_METERS = 6_371_000

export const GeoSearchCirclePipeline = (input?: GeoSearchCircleInput): Pipeline => {
  if (!input) return []

  const location = [input.center.lng, input.center.lat]
  const radiusInRadians = input.radius / EARTH_RADIUS_IN_METERS

  return [
    { $addFields: { location: { type: 'Point', coordinates: ['$lng', '$lat'] } } },
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [location, radiusInRadians]
          }
        }
      }
    }
  ]
}

export default GeoSearchCirclePipeline
