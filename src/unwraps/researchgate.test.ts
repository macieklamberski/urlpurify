import { describe, expect, it } from 'bun:test'
import { unwrapResearchgate } from './researchgate.js'

describe('unwrapResearchgate', () => {
  it('should extract a percent-encoded target from the deref path', () => {
    const url = new URL(
      'https://www.researchgate.net/deref/http%3A%2F%2Fwww.example.com%2Fpubmed%2F16884344',
    )

    expect(unwrapResearchgate(url)).toBe('http://www.example.com/pubmed/16884344')
  })

  it('should drop the _sg token beside a percent-encoded target', () => {
    const url = new URL(
      'https://www.researchgate.net/deref/http%3A%2F%2Fdx.example.org%2F10.1002%2Ftie.5060280112?_sg%5B0%5D=tBHqYRH0Xv4kTEg5-ydSYvIz_z95R-XTYqpY3O8Fi8a5g1',
    )

    expect(unwrapResearchgate(url)).toBe('http://dx.example.org/10.1002/tie.5060280112')
  })

  it('should keep the encoded query of a percent-encoded target', () => {
    const url = new URL(
      'https://www.researchgate.net/deref/https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3Dcohort%26page%3D2',
    )

    expect(unwrapResearchgate(url)).toBe('https://www.example.com/search?q=cohort&page=2')
  })

  it('should extract a plain target from the deref path', () => {
    const url = new URL(
      'https://www.researchgate.net/deref/https://www.example.com/boards/378006-dice/81108398',
    )

    expect(unwrapResearchgate(url)).toBe('https://www.example.com/boards/378006-dice/81108398')
  })

  it('should keep the query and fragment of a plain target', () => {
    const url = new URL(
      'https://www.researchgate.net/deref/https://www.example.com/article?id=42#results',
    )

    expect(unwrapResearchgate(url)).toBe('https://www.example.com/article?id=42#results')
  })

  it('should extract target from the go.Deref.html url param', () => {
    const url = new URL(
      'http://www.researchgate.net/go.Deref.html?url=http%3A%2F%2Fweb.example.edu%2Fdrela%2FPublic%2Fweb%2Fxfoil%2F',
    )

    expect(unwrapResearchgate(url)).toBe('http://web.example.edu/drela/Public/web/xfoil/')
  })

  it('should return undefined for a publication page', () => {
    const url = new URL('https://www.researchgate.net/publication/123_Title')

    expect(unwrapResearchgate(url)).toBeUndefined()
  })

  it('should return undefined for the deref path on another host', () => {
    const url = new URL('https://www.example.com/deref/https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapResearchgate(url)).toBeUndefined()
  })

  it('should return undefined for a deref path that holds no url', () => {
    const url = new URL('https://www.researchgate.net/deref/publication%2F123')

    expect(unwrapResearchgate(url)).toBeUndefined()
  })

  it('should return undefined for a malformed escape in the deref path', () => {
    const url = new URL(
      'https://www.researchgate.net/deref/https%3A%2F%2Fwww.example.com%2F%E0%A4%A',
    )

    expect(unwrapResearchgate(url)).toBeUndefined()
  })

  it('should return undefined for the bare deref path', () => {
    const url = new URL('https://www.researchgate.net/deref/')

    expect(unwrapResearchgate(url)).toBeUndefined()
  })
})
