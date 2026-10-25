import { describe, expect, it } from 'bun:test'
import { unwrapMozillaOutgoing } from './mozillaOutgoing.js'

describe('unwrapMozillaOutgoing', () => {
  it('should decode target from AWS host path', () => {
    const sha = 'a'.repeat(64)
    const url = new URL(
      `https://outgoing.prod.mozaws.net/v1/${sha}/https%3A%2F%2Fexample.com%2Farticle`,
    )

    expect(unwrapMozillaOutgoing(url)).toBe('https://example.com/article')
  })

  it('should decode target from GCP host path', () => {
    const sha = 'b'.repeat(64)
    const url = new URL(
      `https://prod.outgoing.prod.webservices.mozgcp.net/v1/${sha}/https%3A%2F%2Fexample.com%2Fpage`,
    )

    expect(unwrapMozillaOutgoing(url)).toBe('https://example.com/page')
  })

  it('should return undefined for non-Mozilla hosts', () => {
    const sha = 'c'.repeat(64)
    const url = new URL(`https://example.com/v1/${sha}/https%3A%2F%2Fother.com`)

    expect(unwrapMozillaOutgoing(url)).toBeUndefined()
  })

  it('should return undefined when path lacks /v1/<sha256>/ prefix', () => {
    const url = new URL('https://outgoing.prod.mozaws.net/other?url=https%3A%2F%2Fexample.com')

    expect(unwrapMozillaOutgoing(url)).toBeUndefined()
  })

  it('should keep a malformed escape in the target as written', () => {
    const sha = 'd'.repeat(64)
    const url = new URL(
      `https://outgoing.prod.mozaws.net/v1/${sha}/https%3A%2F%2Fexample.com%2F100%ZZ`,
    )

    expect(unwrapMozillaOutgoing(url)).toBe('https://example.com/100%ZZ')
  })
})
