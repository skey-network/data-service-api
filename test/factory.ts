// import * as Crypto from '@waves/ts-lib-crypto'

// export interface TestDevice {
//   address: string
//   name: string
// }

// export interface TestKey {
//   assetId: string
//   device: string
//   owner: string
// }

// export interface TestUser {
//   address: string
// }

// export const createHash = (length: number) =>
//   Crypto.base58Encode(Crypto.randomBytes(length)).substring(0, length)

// export const createDevice = (): TestDevice => ({
//   address: createHash(35),
//   name: createHash(16)
// })

// export const createKey = (device: string, owner: string): TestKey => ({
//   assetId: createHash(44),
//   device,
//   owner
// })

// export const createUser = (): TestUser => ({
//   address: createHash(35)
// })

// export const multiplyFunc = <T>(n: number, func: () => T) =>
//   Array(n).fill(null).map(func)
