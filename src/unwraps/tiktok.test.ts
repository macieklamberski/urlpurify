import { describe, expect, it } from 'bun:test'
import { unwrapTiktok } from './tiktok.js'

describe('unwrapTiktok', () => {
  it('should extract the target from a bio link', () => {
    const value = new URL(
      'https://www.tiktok.com/link/v2?aid=1988&lang=en&scene=bio_url&target=https%3A%2F%2Flinktr.ee%2Fexample',
    )
    const expected = 'https://linktr.ee/example'

    expect(unwrapTiktok(value)).toBe(expected)
  })

  it('should return undefined for a bio link without target', () => {
    const value = new URL('https://www.tiktok.com/link/v2?aid=1988&lang=en&scene=bio_url')

    expect(unwrapTiktok(value)).toBeUndefined()
  })

  it('should return undefined for the login return', () => {
    const value = new URL(
      'https://www.tiktok.com/login?redirect_url=https%3A%2F%2Fwww.example.com%2F&target=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTiktok(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/link/v2?target=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapTiktok(value)).toBeUndefined()
  })
})
