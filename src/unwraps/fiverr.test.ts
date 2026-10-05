import { describe, expect, it } from 'bun:test'
import { unwrapFiverr } from './fiverr.js'

describe('unwrapFiverr', () => {
  it('should extract the target from a go.fiverr.com link', () => {
    const url = new URL(
      'https://go.fiverr.com/visit/?bta=723645&brand=fb&landingPage=https%3A%2F%2Fexample.com%2Fseller',
    )

    expect(unwrapFiverr(url)).toBe('https://example.com/seller')
  })

  it('should extract the target from a track.fiverr.com link', () => {
    const url = new URL(
      'http://track.fiverr.com/visit/?bta=34268&nci=5497&campaign=66147705&landingPage=http%3A%2F%2Fexample.com%2Fseller',
    )

    expect(unwrapFiverr(url)).toBe('http://example.com/seller')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://go.fiverr.com/visit/?bta=1096440&brand=fiverrmarketplace&landingPage=https%253A%252F%252Fexample.com%252Fcategories%252Flogo-design%253Fsource%253Dhome',
    )

    expect(unwrapFiverr(url)).toBe('https://example.com/categories/logo-design?source=home')
  })

  it('should return undefined when landingPage is missing', () => {
    const url = new URL('https://go.fiverr.com/visit/?bta=723645&brand=fb')

    expect(unwrapFiverr(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://go.fiverr.com/visit?bta=723645&landingPage=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapFiverr(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/visit/?bta=723645&landingPage=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapFiverr(url)).toBeUndefined()
  })
})
