import { AuthGuard } from './auth.guard'
import { Request } from 'express'
import config from '../config'

describe('AuthGuard', () => {
  let guard: AuthGuard

  beforeEach(() => {
    guard = new AuthGuard()
  })

  it('returns true when env apiKey', () => {
    const request = {
      headers: { 'x-api-key': config().app.apiKey }
    } as unknown as Request

    expect(guard.validate(request)).toBe(true)
  })

  it('returns false when not env apiKey', () => {
    const request = { headers: { 'x-api-key': 'invalid' } } as unknown as Request

    expect(guard.validate(request)).toBe(false)
  })
})
