import { describe, expect, it } from 'bun:test'
import { unwrapWpPoczta } from './wpPoczta.js'

describe('unwrapWpPoczta', () => {
  it('should extract the target from the webmail redirect', () => {
    const url = new URL(
      'https://zasobygwp.pl/redirect?sig=d15c2806b9283629641d93356884877ad6838ff8ce78b3b4a57be1a9d4e843c3&url=aHR0cHM6Ly93d3cuZXhhbXBsZS5wbC9hcnR5a3VsP2lkPTQy&brand=wp',
    )

    expect(unwrapWpPoczta(url)).toBe('https://www.example.pl/artykul?id=42')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://zasobygwp.pl/redirect?sig=d15c2806b9283629641d93356884877ad6838ff8ce78b3b4a57be1a9d4e843c3&url=ZnRwOi8vZXhhbXBsZS5wbC9wbGlrLnR4dA',
    )

    expect(unwrapWpPoczta(url)).toBeUndefined()
  })

  it('should return undefined for the redirect without url', () => {
    const url = new URL(
      'https://zasobygwp.pl/redirect?sig=d15c2806b9283629641d93356884877ad6838ff8ce78b3b4a57be1a9d4e843c3',
    )

    expect(unwrapWpPoczta(url)).toBeUndefined()
  })

  it('should return undefined for the image proxy', () => {
    const url = new URL(
      'https://zasobygwp.pl/proxy?sig=abc&url=aHR0cHM6Ly93d3cuZXhhbXBsZS5wbC9hLnBuZw',
    )

    expect(unwrapWpPoczta(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/redirect?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5wbC8')

    expect(unwrapWpPoczta(url)).toBeUndefined()
  })
})
