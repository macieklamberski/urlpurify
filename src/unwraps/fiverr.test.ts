import { describe, expect, it } from 'bun:test'
import { unwrapFiverr } from './fiverr.js'

describe('unwrapFiverr', () => {
  it('should extract the target from a go.fiverr.com link', () => {
    const value = new URL(
      'https://go.fiverr.com/visit/?bta=723645&brand=fb&landingPage=https%3A%2F%2Fexample.com%2Fseller',
    )
    const expected = 'https://example.com/seller'

    expect(unwrapFiverr(value)).toBe(expected)
  })

  it('should extract the target from a track.fiverr.com link', () => {
    const value = new URL(
      'http://track.fiverr.com/visit/?bta=34268&nci=5497&campaign=66147705&landingPage=http%3A%2F%2Fexample.com%2Fseller',
    )
    const expected = 'http://example.com/seller'

    expect(unwrapFiverr(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://go.fiverr.com/visit/?bta=1096440&brand=fiverrmarketplace&landingPage=https%253A%252F%252Fexample.com%252Fcategories%252Flogo-design%253Fsource%253Dhome',
    )
    const expected = 'https://example.com/categories/logo-design?source=home'

    expect(unwrapFiverr(value)).toBe(expected)
  })

  it('should return undefined when landingPage is missing', () => {
    const value = new URL('https://go.fiverr.com/visit/?bta=723645&brand=fb')

    expect(unwrapFiverr(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://go.fiverr.com/visit?bta=723645&landingPage=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapFiverr(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/visit/?bta=723645&landingPage=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapFiverr(value)).toBeUndefined()
  })
})
