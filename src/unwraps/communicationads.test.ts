import { describe, expect, it } from 'bun:test'
import { unwrapCommunicationads } from './communicationads.js'

describe('unwrapCommunicationads', () => {
  it('should extract a plain target from deeplink param', () => {
    const value = new URL(
      'https://www.communicationads.net/tc.php?t=11317C16032500T&deeplink=https://www.example.com/e-shop/apple-iphone-17-pro-details&subid=rss',
    )
    const expected = 'https://www.example.com/e-shop/apple-iphone-17-pro-details'

    expect(unwrapCommunicationads(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from deeplink param', () => {
    const value = new URL(
      'https://www.communicationads.net/tc.php?t=10482C34938661T&deeplink=https%3A%2F%2Fwww.example.com%2Fsamsung-galaxy-s26-ultra%2Fangebot%3Fabonnement%3Dallnet',
    )
    const expected = 'https://www.example.com/samsung-galaxy-s26-ultra/angebot?abonnement=allnet'

    expect(unwrapCommunicationads(value)).toBe(expected)
  })

  it('should return undefined when deeplink param is missing', () => {
    const value = new URL('https://www.communicationads.net/tc.php?t=11317C16032500T')

    expect(unwrapCommunicationads(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the communicationAds host', () => {
    const value = new URL(
      'https://www.communicationads.net/tb.php?t=11317C16032500T&deeplink=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapCommunicationads(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/tc.php?t=11317C16032500T&deeplink=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapCommunicationads(value)).toBeUndefined()
  })
})
