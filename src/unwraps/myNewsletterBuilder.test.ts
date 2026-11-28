import { describe, expect, it } from 'bun:test'
import { unwrapMyNewsletterBuilder } from './myNewsletterBuilder.js'

describe('unwrapMyNewsletterBuilder', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'http://report.mnb.email/t.js?s=6a28e368b7881042726d0c1b&u=54269155&v=3&key=cca6&skey=d466a56d73&url=http%3A%2F%2Fexample.com%2F',
    )
    const expected = 'http://example.com/'

    expect(unwrapMyNewsletterBuilder(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL(
      'http://report.mnb.email/t.js?s=6a28e368b7881042726d0c1b&u=54269155&v=3&key=cca6&skey=d466a56d73',
    )

    expect(unwrapMyNewsletterBuilder(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'http://report.mnb.email/o.js?s=6a28e368b7881042726d0c1b&url=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapMyNewsletterBuilder(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL('http://example.com/t.js?url=http%3A%2F%2Fexample.org%2F')

    expect(unwrapMyNewsletterBuilder(value)).toBeUndefined()
  })
})
