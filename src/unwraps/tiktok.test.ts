import { describe, expect, it } from 'bun:test'
import { unwrapTiktok } from './tiktok.js'

describe('unwrapTiktok', () => {
  it('should extract the target from a bio link', () => {
    const url = new URL(
      'https://www.tiktok.com/link/v2?aid=1988&lang=en&scene=bio_url&target=https%3A%2F%2Flinktr.ee%2Fexample',
    )

    expect(unwrapTiktok(url)).toBe('https://linktr.ee/example')
  })

  it('should return undefined for a bio link without target', () => {
    const url = new URL('https://www.tiktok.com/link/v2?aid=1988&lang=en&scene=bio_url')

    expect(unwrapTiktok(url)).toBeUndefined()
  })

  it('should return undefined for the login return', () => {
    const url = new URL(
      'https://www.tiktok.com/login?redirect_url=https%3A%2F%2Fwww.example.com%2F&target=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTiktok(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/link/v2?target=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapTiktok(url)).toBeUndefined()
  })
})
