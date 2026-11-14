import { describe, expect, it } from 'bun:test'
import { unwrapPrxPlayer } from './prxPlayer.js'

describe('unwrapPrxPlayer', () => {
  it('should extract the feed from the listen page', () => {
    const value = new URL(
      'https://play.prx.org/listen?ge=prx_415_3844d558-bf88-4968-bf9f-e3faade0782a&uf=https%3A%2F%2Fexample.com%2FAfterHours_TAC',
    )
    const expected = 'https://example.com/AfterHours_TAC'

    expect(unwrapPrxPlayer(value)).toBe(expected)
  })

  it('should extract the feed from the embed', () => {
    const value = new URL(
      'https://play.prx.org/e?ge=prx_12963_8a540d09-6ca3-408c-ae86-956e1bb2bda8&uf=https%3A%2F%2Fexample.com%2Ff%2F12963%2Ffeed-rss.xml',
    )
    const expected = 'https://example.com/f/12963/feed-rss.xml'

    expect(unwrapPrxPlayer(value)).toBe(expected)
  })

  it('should extract a feed with an unencoded scheme colon', () => {
    const value = new URL(
      'https://play.prx.org/e?uf=http:%2F%2Fexample.com%2Fearhustlesq&ge=prx_59_fac58065-7b8d-4772-ba0c-b07bbec9564e&gs=_blank',
    )
    const expected = 'http://example.com/earhustlesq'

    expect(unwrapPrxPlayer(value)).toBe(expected)
  })

  it('should extract a twice-encoded feed', () => {
    const value = new URL('https://play.prx.org/listen?uf=https%253A%252F%252Fexample.com%252Ffeed')
    const expected = 'https://example.com/feed'

    expect(unwrapPrxPlayer(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://play.prx.org/Listen?uf=https%3A%2F%2Fexample.com%2Ffeed')
    const expected = 'https://example.com/feed'

    expect(unwrapPrxPlayer(value)).toBe(expected)
  })

  it('should return undefined when the uf param is missing', () => {
    const value = new URL(
      'https://play.prx.org/listen?ge=prx_415_3844d558-bf88-4968-bf9f-e3faade0782a',
    )

    expect(unwrapPrxPlayer(value)).toBeUndefined()
  })

  it('should return undefined when the uf param is empty', () => {
    const value = new URL(
      'https://play.prx.org/e?uf=&ge=prx_415_3844d558-bf88-4968-bf9f-e3faade0782a',
    )

    expect(unwrapPrxPlayer(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://play.prx.org/embed-code?uf=https%3A%2F%2Fexample.com%2Ffeed')

    expect(unwrapPrxPlayer(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://play.example.org/listen?uf=https%3A%2F%2Fexample.com%2Ffeed')

    expect(unwrapPrxPlayer(value)).toBeUndefined()
  })
})
