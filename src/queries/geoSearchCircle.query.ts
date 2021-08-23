import { Pipeline } from 'src/common/common.interfaces'
import { GeoSearchCircleInput } from '../devices/devices.args'

export const GeoSearchCirclePipeline = (input?: GeoSearchCircleInput): Pipeline => {
  if (!input) return []

  const location = [input.center.lng, input.center.lat]

  return [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: location
        },
        distanceField: 'distance',
        maxDistance: input.radius,
        key: 'location'
      }
    }
  ]
}

export default GeoSearchCirclePipeline
