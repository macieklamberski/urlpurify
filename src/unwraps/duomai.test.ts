import { describe, expect, it } from 'bun:test'
import { unwrapDuomai } from './duomai.js'

describe('unwrapDuomai', () => {
  it('should extract a plain target from t param', () => {
    const url = new URL(
      'https://c.duomai.com/track.php?site_id=242986&euid=&t=https://www.example.com/',
    )

    expect(unwrapDuomai(url)).toBe('https://www.example.com/')
  })

  it('should extract a percent-encoded target from t param', () => {
    const url = new URL(
      'https://c.duomai.com/track.php?aid=4705&dm_fid=16052&euid=&site_id=261624&t=https%3a%2f%2fwww.example.com%2fdetail%3fgid%3d184051',
    )

    expect(unwrapDuomai(url)).toBe('https://www.example.com/detail?gid=184051')
  })

  it('should return undefined when t param is missing', () => {
    const url = new URL('https://c.duomai.com/track.php?site_id=242986&euid=')

    expect(unwrapDuomai(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Duomai host', () => {
    const url = new URL(
      'https://c.duomai.com/yqtrack.php?site_id=86583&t=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapDuomai(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/track.php?site_id=242986&t=https://www.example.org/')

    expect(unwrapDuomai(url)).toBeUndefined()
  })
})
