import { describe, expect, it } from 'bun:test'
import { unwrapAddToAny } from './addToAny.js'

describe('unwrapAddToAny', () => {
  it('should extract the page from a service link', () => {
    const value = new URL(
      'https://www.addtoany.com/add_to/facebook?linkurl=https%3A%2F%2Fexample.com%2F127%2F&linkname=%D8%AD%D9%83%D8%A7%D9%8A%D8%A7',
    )
    const expected = 'https://example.com/127/'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should extract an unencoded page from a service link', () => {
    const value = new URL(
      'https://www.addtoany.com/add_to/facebook?linkurl=https://example.com/main/mini-cruise-favignana-and-levanzo/',
    )
    const expected = 'https://example.com/main/mini-cruise-favignana-and-levanzo/'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should extract the page from the email link', () => {
    const value = new URL(
      'http://www.addtoany.com/email?linkurl=http%3A%2F%2Fexample.com%2F2010%2F08%2F13%2Ftolerance-of-religion-vs-respect-for-religion%2F&linkname=Tolerance',
    )
    const expected = 'http://example.com/2010/08/13/tolerance-of-religion-vs-respect-for-religion/'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should extract the page from the share menu query', () => {
    const value = new URL(
      'https://www.addtoany.com/share?linkurl=http%3A%2F%2Fexample.org%2FHebrew-School-Posts%2F4244744&linkname=Through%20the%20Eyes%20of%20Two%20Teens',
    )
    const expected = 'http://example.org/Hebrew-School-Posts/4244744'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should extract the page from the share menu fragment', () => {
    const value = new URL(
      'https://www.addtoany.com/share#url=https%3A%2F%2Fexample.com%2Fnews%2Fubax-advanced-multicam-gen3-preorder&title=UBAX%20Advanced%20Multicam%20Gen3%20Preorder',
    )
    const expected = 'https://example.com/news/ubax-advanced-multicam-gen3-preorder'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should extract the page from the share_save menu query', () => {
    const value = new URL(
      'http://www.addtoany.com/share_save?linkurl=https%3A%2F%2Fexample.com%2Fblog%2Fv-tallinne-mechtayut-zapustit-skorostnoe-metro&linkname=%D0%92%20%D0%A2%D0%B0%D0%BB',
    )
    const expected = 'https://example.com/blog/v-tallinne-mechtayut-zapustit-skorostnoe-metro'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should extract the page from the share_save menu fragment', () => {
    const value = new URL(
      'http://www.addtoany.com/share_save#url=https%3A%2F%2Fexample.org%2Fwater-ripple-javascript%2F&title=Water%20ripple%20javascript',
    )
    const expected = 'https://example.org/water-ripple-javascript/'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should extract the page on the bare host', () => {
    const value = new URL('https://addtoany.com/share?linkurl=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL(
      'https://www.addtoany.com/add_to/x?linkurl=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://www.addtoany.com/Add_To/facebook?linkurl=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapAddToAny(value)).toBe(expected)
  })

  it('should return undefined when the linkurl param is missing', () => {
    const value = new URL('https://www.addtoany.com/add_to/facebook?linkname=Hello')

    expect(unwrapAddToAny(value)).toBeUndefined()
  })

  it('should return undefined when the linkurl param is empty', () => {
    const value = new URL('https://www.addtoany.com/add_to/facebook?linkurl=&linkname=Hello')

    expect(unwrapAddToAny(value)).toBeUndefined()
  })

  it('should return undefined for the share menu without a page', () => {
    const value = new URL('https://www.addtoany.com/share#title=Hello')

    expect(unwrapAddToAny(value)).toBeUndefined()
  })

  it('should return undefined for a non-http page', () => {
    const value = new URL('https://www.addtoany.com/add_to/facebook?linkurl=javascript%3Aalert(1)')

    expect(unwrapAddToAny(value)).toBeUndefined()
  })

  it('should return undefined for the fragment on a service link', () => {
    const value = new URL(
      'https://www.addtoany.com/add_to/facebook#url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapAddToAny(value)).toBeUndefined()
  })

  it('should return undefined for the subscribe page', () => {
    const value = new URL(
      'https://www.addtoany.com/subscribe?linkurl=https%3A%2F%2Fexample.com%2Ffeed&linkname=Example',
    )

    expect(unwrapAddToAny(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/add_to/facebook?linkurl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapAddToAny(value)).toBeUndefined()
  })
})
