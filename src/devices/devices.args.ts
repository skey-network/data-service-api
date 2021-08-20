import { ArgsType, Field, Float, InputType } from '@nestjs/graphql'
import {
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPositive,
  ValidateNested
} from 'class-validator'
import { IsBlockchainAddress } from '../common/common.decorators'
import { CommonIndexArgs } from '../common/common.args'

const keysOwnerDescription = `
  Returns list of devices to which an address has keys. For example, User with address user_1 is
  the owner of keys key_1 and key_2, key_1 is for device_1 and key_2 is for device_2. There are
  also user_2, device_3 and key_3. The method will return [device_1, device_2]. This is helpful
  when user need a list of devices he can interact with.
`

const geoSearchDescription = `
  Retruns list of devices that are inside of selected rectangle. For example, for points [lat:49, lng: 16]
  as bottomLeft and [lat:54, lng:24] as upperRight, it's going to return all devices in Poland.
`

const geoSearchCircleDescription = `
  Returns list of devices within radius of a selected point.
`

const includeRemovedDescription = `
  By default the list will not include Devices which have been removed by the Supplier.
  To also get removed Devices, set this flag to true.
`

const geoSearchRadiusDescription = `
  Radius of a circle in meters.
`

@InputType()
export class Point {
  @Field(() => Float)
  @IsLatitude()
  lat: number

  @Field(() => Float)
  @IsLongitude()
  lng: number
}

@InputType()
export class GeoSearchInput {
  @Field(() => Point)
  @ValidateNested()
  bottomLeft: Point

  @Field(() => Point)
  @ValidateNested()
  upperRight: Point
}

@InputType()
export class GeoSearchCircleInput {
  @Field(() => Point)
  @ValidateNested()
  center: Point

  @Field(() => Float, { description: geoSearchRadiusDescription })
  @IsPositive()
  radius: number
}

@InputType()
export class DevicesFilter {
  @Field({ nullable: true })
  @IsBlockchainAddress()
  @IsOptional()
  supplier?: string

  @Field({ nullable: true })
  @IsBlockchainAddress()
  @IsOptional()
  owner?: string

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  visible?: boolean

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  connected?: boolean

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  whitelisted?: boolean
}

@ArgsType()
export class DevicesArgs extends CommonIndexArgs {
  @Field(() => DevicesFilter, { defaultValue: {} })
  @ValidateNested()
  filter: DevicesFilter

  @Field(() => GeoSearchInput, { nullable: true, description: geoSearchDescription })
  @ValidateNested()
  geoSearch?: GeoSearchInput

  @Field(() => GeoSearchCircleInput, {
    nullable: true,
    description: geoSearchCircleDescription
  })
  @ValidateNested()
  geoSearchCircle?: GeoSearchCircleInput

  @Field(() => String, { nullable: true, description: keysOwnerDescription })
  @IsBlockchainAddress()
  @IsOptional()
  keysOwner?: string

  @Field(() => Boolean, {
    nullable: true,
    description: includeRemovedDescription,
    defaultValue: false
  })
  @IsOptional()
  includeRemoved?: boolean
}

@ArgsType()
export class DevicesByKeys extends DevicesArgs {
  @Field()
  @IsBlockchainAddress()
  address: string
}

export const DeviceFilterFields = Object.freeze([
  'supplier',
  'owner',
  'visible',
  'active',
  'connected',
  'whitelisted'
])
