import { describe, expect, it } from 'bun:test'
import { unwrapCommunicationads } from './communicationads.js'

describe('unwrapCommunicationads', () => {
  it('should extract a plain target from deeplink param', () => {
    const url = new URL(
      'https://www.communicationads.net/tc.php?t=11317C16032500T&deeplink=https://www.example.com/e-shop/apple-iphone-17-pro-details&subid=rss',
    )

    expect(unwrapCommunicationads(url)).toBe(
      'https://www.example.com/e-shop/apple-iphone-17-pro-details',
    )
  })

  it('should extract a percent-encoded target from deeplink param', () => {
    const url = new URL(
      'https://www.communicationads.net/tc.php?t=10482C34938661T&deeplink=https%3A%2F%2Fwww.example.com%2Fsamsung-galaxy-s26-ultra%2Fangebot%3Fabonnement%3Dallnet',
    )

    expect(unwrapCommunicationads(url)).toBe(
      'https://www.example.com/samsung-galaxy-s26-ultra/angebot?abonnement=allnet',
    )
  })

  it('should return undefined when deeplink param is missing', () => {
    const url = new URL('https://www.communicationads.net/tc.php?t=11317C16032500T')

    expect(unwrapCommunicationads(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the communicationAds host', () => {
    const url = new URL(
      'https://www.communicationads.net/tb.php?t=11317C16032500T&deeplink=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapCommunicationads(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/tc.php?t=11317C16032500T&deeplink=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapCommunicationads(url)).toBeUndefined()
  })
})
