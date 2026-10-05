import { describe, expect, it } from 'bun:test'
import { unwrapShareit } from './shareit.js'

describe('unwrapShareit', () => {
  it('should extract the target from the affiliate link', () => {
    const url = new URL(
      'http://www.shareit.com/affiliate.html?affiliateid=200238388&publisherid=200112235&target=http%3A%2F%2Fwww.example.com%2F%3Fq%3Dthemes',
    )

    expect(unwrapShareit(url)).toBe('http://www.example.com/?q=themes')
  })

  it('should extract the target from the secure affiliate link', () => {
    const url = new URL(
      'https://secure.shareit.com/shareit/affiliate.html?publisherid=26239&affiliateid=200120544&target=http://www.example.com',
    )

    expect(unwrapShareit(url)).toBe('http://www.example.com')
  })

  it('should return undefined when the target param is missing', () => {
    const url = new URL('http://www.shareit.com/affiliate.html?affiliateid=200238388')

    expect(unwrapShareit(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'http://www.shareit.com/product.html?target=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapShareit(url)).toBeUndefined()
  })
})
