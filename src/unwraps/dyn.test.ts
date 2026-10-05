import { describe, expect, it } from 'bun:test'
import { unwrapDyn } from './dyn.js'

describe('unwrapDyn', () => {
  it('should extract target from R param', () => {
    const url = new URL(
      'http://link.email.dynect.net/link.php?DynEngagement=true&H=w8Bl7ZSLqC%2BFFEF9P0XN9HJB14ltnTgt&G=0&R=http%3A%2F%2Fwww.example.com&I=20180213082309.0000014fd2b4%40mail6-51-ussnn1&X=MHwxMDQ2NzU4OjVhODJmOGQ1',
    )

    expect(unwrapDyn(url)).toBe('http://www.example.com')
  })

  it('should extract target encoded twice', () => {
    const url = new URL(
      'http://icm-tracking.meltwater.com/link.php?DynEngagement=true&H=AqX%2Fyxxn&G=0&R=https%253A%252F%252Fwww.example.com%252Fpage',
    )

    expect(unwrapDyn(url)).toBe('https://www.example.com/page')
  })

  it('should return undefined when R param is missing', () => {
    const url = new URL('http://link.email.dynect.net/link.php?DynEngagement=true&H=x')

    expect(unwrapDyn(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('http://link.email.dynect.net/open.php?R=https%3A%2F%2Fwww.example.com')

    expect(unwrapDyn(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'http://example.com/link.php?DynEngagement=true&R=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapDyn(url)).toBeUndefined()
  })
})
