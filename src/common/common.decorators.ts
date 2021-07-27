import { Matches } from 'class-validator'

const BLOCKCHAIN_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{35}$/
const BLOCKCHAIN_TX_HASH_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

export const IsBlockchainAddress = () =>
  Matches(BLOCKCHAIN_ADDRESS_REGEX, {
    message: ({ property, value }) =>
      `${property} must be valid blockchain address. Value ${value} does not match regex ${BLOCKCHAIN_ADDRESS_REGEX}`
  })

export const IsBlockchainTxHash = () =>
  Matches(BLOCKCHAIN_TX_HASH_REGEX, {
    message: ({ property, value }) =>
      `${property} must be valid blockchain tx hash. Value ${value} does not match regex ${BLOCKCHAIN_TX_HASH_REGEX}`
  })
