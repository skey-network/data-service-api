import { Matches } from 'class-validator'

const BLOCKCHAIN_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{35}$/
const BLOCKCHAIN_ASSET_ID_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

export const IsBlockchainAddress = () =>
  Matches(BLOCKCHAIN_ADDRESS_REGEX, {
    message: ({ property, value }) =>
      `${property} must be valid blockchain address. Value ${value} does not match regex ${BLOCKCHAIN_ADDRESS_REGEX}`
  })

export const IsBlockchainTxHash = () =>
  Matches(BLOCKCHAIN_ASSET_ID_REGEX, {
    message: ({ property, value }) =>
      `${property} must be valid blockchain asset id. Value ${value} does not match regex ${BLOCKCHAIN_ASSET_ID_REGEX}`
  })
