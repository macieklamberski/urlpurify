import { describe, expect, it } from 'bun:test'
import { unwrapMyNewsletterBuilder } from './myNewsletterBuilder.js'

describe('unwrapMyNewsletterBuilder', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'http://report.mnb.email/t.js?s=6a28e368b7881042726d0c1b&u=54269155&v=3&key=cca6&skey=d466a56d73&url=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapMyNewsletterBuilder(url)).toBe('http://example.com/')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL(
      'http://report.mnb.email/t.js?s=6a28e368b7881042726d0c1b&u=54269155&v=3&key=cca6&skey=d466a56d73',
    )

    expect(unwrapMyNewsletterBuilder(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'http://report.mnb.email/o.js?s=6a28e368b7881042726d0c1b&url=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapMyNewsletterBuilder(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('http://example.com/t.js?url=http%3A%2F%2Fexample.org%2F')

    expect(unwrapMyNewsletterBuilder(url)).toBeUndefined()
  })
})
