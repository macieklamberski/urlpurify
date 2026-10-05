import { describe, expect, it } from 'bun:test'
import { unwrapLnkam } from './lnkam.js'

describe('unwrapLnkam', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://go.lnkam.com/link/r?campaign_id=b7YMMAqMdAL7wyzNe5m3wz&source=4apvesisr53xcf&u=https%3A%2F%2Fwww.example.com%2Fus%2Falbum%2Fblood-orange-single%2Fid1527044668',
    )

    expect(unwrapLnkam(url)).toBe(
      'https://www.example.com/us/album/blood-orange-single/id1527044668',
    )
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://go.lnkam.com/link/r?campaign_id=b7YMMAqMdAL7wyzNe5m3wz')

    expect(unwrapLnkam(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the lnkam host', () => {
    const url = new URL(
      'https://go.lnkam.com/link/i?campaign_id=b7YMMAqMdAL7wyzNe5m3wz&u=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLnkam(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/link/r?campaign_id=b7YMMAqMdAL7wyzNe5m3wz&u=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLnkam(url)).toBeUndefined()
  })
})
