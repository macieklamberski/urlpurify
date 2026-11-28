import { describe, expect, it } from 'bun:test'
import { unwrapFtc } from './ftc.js'

describe('unwrapFtc', () => {
  it('should extract target from external_url param', () => {
    const value = new URL(
      'https://www.ftc.gov/now-leaving?external_url=https%3A%2F%2Fwww.example.com%2Fj%2F91900289362&back_url=https%3A%2F%2Fwww.ftc.gov%2Fnews-events%2Fnews%2Fpress-releases',
    )
    const expected = 'https://www.example.com/j/91900289362'

    expect(unwrapFtc(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://consumer.ftc.gov/now-leaving?external_url=https://www.example.com/&back_url=https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapFtc(value)).toBe(expected)
  })

  it('should return undefined when external_url param is missing', () => {
    const value = new URL('https://www.ftc.gov/now-leaving?back_url=https%3A%2F%2Fwww.ftc.gov%2F')

    expect(unwrapFtc(value)).toBeUndefined()
  })

  it('should return undefined when external_url param is empty', () => {
    const value = new URL('https://www.ftc.gov/now-leaving?external_url=')

    expect(unwrapFtc(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://www.ftc.gov/news-events?external_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapFtc(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL(
      'https://www.example.gov/now-leaving?external_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapFtc(value)).toBeUndefined()
  })
})
