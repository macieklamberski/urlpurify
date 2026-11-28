import { describe, expect, it } from 'bun:test'
import { unwrapShareit } from './shareit.js'

describe('unwrapShareit', () => {
  it('should extract the target from the affiliate link', () => {
    const value = new URL(
      'http://www.shareit.com/affiliate.html?affiliateid=200238388&publisherid=200112235&target=http%3A%2F%2Fwww.example.com%2F%3Fq%3Dthemes',
    )
    const expected = 'http://www.example.com/?q=themes'

    expect(unwrapShareit(value)).toBe(expected)
  })

  it('should extract the target from the secure affiliate link', () => {
    const value = new URL(
      'https://secure.shareit.com/shareit/affiliate.html?publisherid=26239&affiliateid=200120544&target=http://www.example.com',
    )
    const expected = 'http://www.example.com'

    expect(unwrapShareit(value)).toBe(expected)
  })

  it('should return undefined when the target param is missing', () => {
    const value = new URL('http://www.shareit.com/affiliate.html?affiliateid=200238388')

    expect(unwrapShareit(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'http://www.shareit.com/product.html?target=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapShareit(value)).toBeUndefined()
  })
})
