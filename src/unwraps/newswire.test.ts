import { describe, expect, it } from 'bun:test'
import { unwrapNewswire } from './newswire.js'

describe('unwrapNewswire', () => {
  it('should extract target from a release click link', () => {
    const url = new URL(
      'https://stats.newswire.com/x/html?final=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v&hit%2Csum=WyIzeHozZnUiLCIzeHozZnYiLCIzeHozZnciXQ',
    )

    expect(unwrapNewswire(url)).toBe('https://www.example.com/')
  })

  it('should extract target from a signed click link', () => {
    const url = new URL(
      'https://stats.nwe.io/x/html?final=aHR0cHM6Ly9leGFtcGxlLmNvbS9wcm9kdWN0cy9yZXZpZXdz&sig=9tQ2SAmtUFJ-bHQrrPUDw7rhkZp6ae2hVkfaumIlieJ4L8kFYU2m0givOjo1QPYNC2OObKVdnmgr-O4F42rEDA&hit,sum=WyI1NDBtMjkiLCI1NDBtMmEiLCI1NDBtMjIiXQ',
    )

    expect(unwrapNewswire(url)).toBe('https://example.com/products/reviews')
  })

  it('should decode the url-safe alphabet of the target', () => {
    const url = new URL(
      'https://stats.newswire.com/x/html?final=aHR0cHM6Ly9leGFtcGxlLmNvbS9zZWFyY2g_cT10ZWEmcGFnZT0yI3Jlc3VsdHM',
    )

    expect(unwrapNewswire(url)).toBe('https://example.com/search?q=tea&page=2#results')
  })

  it('should return undefined when final param is missing', () => {
    const url = new URL('https://stats.newswire.com/x/html?hit%2Csum=WyIzeHozZnUiXQ')

    expect(unwrapNewswire(url)).toBeUndefined()
  })

  it('should return undefined for a final param that is not base64', () => {
    const url = new URL('https://stats.newswire.com/x/html?final=not%20base64')

    expect(unwrapNewswire(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://stats.newswire.com/x/html?final=ZnRwOi8vZXhhbXBsZS5jb20vZmlsZQ')

    expect(unwrapNewswire(url)).toBeUndefined()
  })

  it('should return undefined for the pixel path', () => {
    const url = new URL(
      'https://stats.newswire.com/x/im?act=eyIxYzAyNmciOiIxYzAxbGYifQ&final=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v',
    )

    expect(unwrapNewswire(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/x/html?final=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v')

    expect(unwrapNewswire(url)).toBeUndefined()
  })
})
