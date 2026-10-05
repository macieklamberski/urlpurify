import { describe, expect, it } from 'bun:test'
import { unwrapNimble } from './nimble.js'

describe('unwrapNimble', () => {
  it('should extract target from redirect param', () => {
    const url = new URL(
      'https://app.nimble.com/api/v1/messages/tracking/click/5337d7943b361f18edf62dc3/59b0e1ad58ac9c524d689385/59ddf9bd58ac9c221f7a9b5a/?redirect=https%3A%2F%2Fconsultations.example.eu%2F',
    )

    expect(unwrapNimble(url)).toBe('https://consultations.example.eu/')
  })

  it('should return undefined when redirect param is missing', () => {
    const url = new URL(
      'https://app.nimble.com/api/v1/messages/tracking/click/5337d7943b361f18edf62dc3/59b0e1ad58ac9c524d689385/59ddf9bd58ac9c221f7a9b5a/',
    )

    expect(unwrapNimble(url)).toBeUndefined()
  })

  it('should return undefined for an id that is not 24 hex characters', () => {
    const url = new URL(
      'https://app.nimble.com/api/v1/messages/tracking/click/5337d794/59b0e1ad58ac9c524d689385/59ddf9bd58ac9c221f7a9b5a/?redirect=https%3A%2F%2Fexample.eu%2F',
    )

    expect(unwrapNimble(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://app.nimble.com/api/v1/messages/tracking/open/5337d7943b361f18edf62dc3/59b0e1ad58ac9c524d689385/59ddf9bd58ac9c221f7a9b5a/?redirect=https%3A%2F%2Fexample.eu%2F',
    )

    expect(unwrapNimble(url)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const url = new URL(
      'https://app.nimble.com/x/api/v1/messages/tracking/click/5337d7943b361f18edf62dc3/59b0e1ad58ac9c524d689385/59ddf9bd58ac9c221f7a9b5a/?redirect=https%3A%2F%2Fexample.eu%2F',
    )

    expect(unwrapNimble(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL(
      'https://example.com/api/v1/messages/tracking/click/5337d7943b361f18edf62dc3/59b0e1ad58ac9c524d689385/59ddf9bd58ac9c221f7a9b5a/?redirect=https%3A%2F%2Fexample.eu%2F',
    )

    expect(unwrapNimble(url)).toBeUndefined()
  })
})
