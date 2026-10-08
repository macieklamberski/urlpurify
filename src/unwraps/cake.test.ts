import { describe, expect, it } from 'bun:test'
import { unwrapCake } from './cake.js'

describe('unwrapCake', () => {
  it('should extract target from ckmrdr param', () => {
    const url = new URL(
      'http://c.jumia.io/?a=2111&c=11&p=r&E=kkYNyk2M4sk%3d&ckmrdr=https%3A%2F%2Fwww.example.com%2Fphantom-5-space-grey.html&s1=tecnophantom5&utm_source=cake',
    )

    expect(unwrapCake(url)).toBe('https://www.example.com/phantom-5-space-grey.html')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'http://www.example.com/?a=2111&c=11&p=r&E=kkYNyk2M4sk%3d&ckmrdr=https%253A%252F%252Fexample.org%252Fpage&s1=tecnophantom5&utm_source=cake',
    )

    expect(unwrapCake(url)).toBe('https://example.org/page')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://www.example.com/?a=2111&c=11&p=r&E=kkYNyk2M4sk%3d&ckmrdr=https://example.org/search/a+b&s1=tecnophantom5&utm_source=cake',
    )

    expect(unwrapCake(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://mixi.mn/?a=169870&c=11545&p=r&ckmrdr=https://www.example.com/product/',
    )

    expect(unwrapCake(url)).toBe('https://www.example.com/product/')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'http://c.secure.komli.com/?a=10349&c=792&p=r&e=pwQx6T231VA%3d&s1=&s2=&ckmrdr=http%3A%2F%2Fwww.example.com%2Fflea-market.html%3Futm_source%3Dkomli%26utm_medium%3DAffiliateSales',
    )

    expect(unwrapCake(url)).toBe(
      'http://www.example.com/flea-market.html?utm_source=komli&utm_medium=AffiliateSales',
    )
  })

  it('should return undefined for another path', () => {
    const url = new URL('https://mixi.mn/click?a=169870&c=11545&ckmrdr=https://www.example.com/')

    expect(unwrapCake(url)).toBeUndefined()
  })

  it('should return undefined without the affiliate param', () => {
    const url = new URL('https://mixi.mn/?c=11545&ckmrdr=https://www.example.com/')

    expect(unwrapCake(url)).toBeUndefined()
  })

  it('should return undefined without the creative param', () => {
    const url = new URL('https://mixi.mn/?a=169870&ckmrdr=https://www.example.com/')

    expect(unwrapCake(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://mixi.mn/?a=169870&c=11545&ckmrdr=javascript%3Aalert(1)')

    expect(unwrapCake(url)).toBeUndefined()
  })

  it('should return undefined when ckmrdr param is missing', () => {
    const url = new URL('https://mixi.mn/?a=169870&c=11545&p=r')

    expect(unwrapCake(url)).toBeUndefined()
  })

  it('should return undefined when ckmrdr param is empty', () => {
    const url = new URL('https://mixi.mn/?a=169870&c=11545&ckmrdr=')

    expect(unwrapCake(url)).toBeUndefined()
  })
})
