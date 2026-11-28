import { describe, expect, it } from 'bun:test'
import { unwrapNewswire } from './newswire.js'

describe('unwrapNewswire', () => {
  it('should extract target from a release click link', () => {
    const value = new URL(
      'https://stats.newswire.com/x/html?final=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v&hit%2Csum=WyIzeHozZnUiLCIzeHozZnYiLCIzeHozZnciXQ',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapNewswire(value)).toBe(expected)
  })

  it('should extract target from a signed click link', () => {
    const value = new URL(
      'https://stats.nwe.io/x/html?final=aHR0cHM6Ly9leGFtcGxlLmNvbS9wcm9kdWN0cy9yZXZpZXdz&sig=9tQ2SAmtUFJ-bHQrrPUDw7rhkZp6ae2hVkfaumIlieJ4L8kFYU2m0givOjo1QPYNC2OObKVdnmgr-O4F42rEDA&hit,sum=WyI1NDBtMjkiLCI1NDBtMmEiLCI1NDBtMjIiXQ',
    )
    const expected = 'https://example.com/products/reviews'

    expect(unwrapNewswire(value)).toBe(expected)
  })

  it('should decode the url-safe alphabet of the target', () => {
    const value = new URL(
      'https://stats.newswire.com/x/html?final=aHR0cHM6Ly9leGFtcGxlLmNvbS9zZWFyY2g_cT10ZWEmcGFnZT0yI3Jlc3VsdHM',
    )
    const expected = 'https://example.com/search?q=tea&page=2#results'

    expect(unwrapNewswire(value)).toBe(expected)
  })

  it('should return undefined when final param is missing', () => {
    const value = new URL('https://stats.newswire.com/x/html?hit%2Csum=WyIzeHozZnUiXQ')

    expect(unwrapNewswire(value)).toBeUndefined()
  })

  it('should return undefined for a final param that is not base64', () => {
    const value = new URL('https://stats.newswire.com/x/html?final=not%20base64')

    expect(unwrapNewswire(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL('https://stats.newswire.com/x/html?final=ZnRwOi8vZXhhbXBsZS5jb20vZmlsZQ')

    expect(unwrapNewswire(value)).toBeUndefined()
  })

  it('should return undefined for the pixel path', () => {
    const value = new URL(
      'https://stats.newswire.com/x/im?act=eyIxYzAyNmciOiIxYzAxbGYifQ&final=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v',
    )

    expect(unwrapNewswire(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/x/html?final=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v')

    expect(unwrapNewswire(value)).toBeUndefined()
  })
})
