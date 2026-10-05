import { describe, expect, it } from 'bun:test'
import { unwrapFtc } from './ftc.js'

describe('unwrapFtc', () => {
  it('should extract target from external_url param', () => {
    const url = new URL(
      'https://www.ftc.gov/now-leaving?external_url=https%3A%2F%2Fwww.example.com%2Fj%2F91900289362&back_url=https%3A%2F%2Fwww.ftc.gov%2Fnews-events%2Fnews%2Fpress-releases',
    )

    expect(unwrapFtc(url)).toBe('https://www.example.com/j/91900289362')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://consumer.ftc.gov/now-leaving?external_url=https://www.example.com/&back_url=https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages',
    )

    expect(unwrapFtc(url)).toBe('https://www.example.com/')
  })

  it('should return undefined when external_url param is missing', () => {
    const url = new URL('https://www.ftc.gov/now-leaving?back_url=https%3A%2F%2Fwww.ftc.gov%2F')

    expect(unwrapFtc(url)).toBeUndefined()
  })

  it('should return undefined when external_url param is empty', () => {
    const url = new URL('https://www.ftc.gov/now-leaving?external_url=')

    expect(unwrapFtc(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://www.ftc.gov/news-events?external_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapFtc(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL(
      'https://www.example.gov/now-leaving?external_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapFtc(url)).toBeUndefined()
  })
})
