import { describe, expect, it } from 'bun:test'
import { unwrapVuture } from './vuture.js'

describe('unwrapVuture', () => {
  it('should extract target from redirect param', () => {
    const value = new URL(
      'https://connect.example.com/email_handler.aspx?sid=blankform&redirect=https%3a%2f%2fwww.example.org%2fen%2fpublications%2f2023%2f08%2fform-i9&checksum=1FC68932',
    )
    const expected = 'https://www.example.org/en/publications/2023/08/form-i9'

    expect(unwrapVuture(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://www.example.com/email_handler.aspx?sid=blankform&redirect=https://example.org/search/a+b&checksum=1FC68932',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapVuture(value)).toBe(expected)
  })

  it('should extract the target on a recipient link without a checksum', () => {
    const value = new URL(
      'https://response.example.com/email_handler.aspx?sid=6df8526a-9fe3-4725-b3cc-09695e2949b2&redirect=https%3a%2f%2fwww.example.org%2fsubscribe%2f',
    )
    const expected = 'https://www.example.org/subscribe/'

    expect(unwrapVuture(value)).toBe(expected)
  })

  it('should extract the target on a vendor host', () => {
    const value = new URL(
      'https://sites-example.vuturevx.com/email_handler.aspx?sid=blankform&redirect=http%3a%2f%2fwww.example.org%2fassets%2f690%2f683065.pdf',
    )
    const expected = 'http://www.example.org/assets/690/683065.pdf'

    expect(unwrapVuture(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://news.example.com/email_handler.aspx?sid=blankform&redirect=https%253a%252f%252fwww.example.org%252ffact-sheets%252f17a-overtime&checksum=3B87DDF7',
    )
    const expected = 'https://www.example.org/fact-sheets/17a-overtime'

    expect(unwrapVuture(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://news.example.com/email_handler.aspx?sid=blankform&redirect=https%253a%252f%252fwww.example.org%252f100%25&checksum=3B87DDF7',
    )
    const expected = 'https://www.example.org/100%'

    expect(unwrapVuture(value)).toBe(expected)
  })

  it('should extract target from the api handler path', () => {
    const value = new URL(
      'https://communications.example.com/api/email/handler?sid=blankform&redirect=https%3a%2f%2fwww.example.org%2fservices%2fhealthcare%2f%23overview&checksum=D21FDD20',
    )
    const expected = 'https://www.example.org/services/healthcare/#overview'

    expect(unwrapVuture(value)).toBe(expected)
  })

  it('should extract a target with a slash-encoded scheme', () => {
    const value = new URL(
      'https://sites-example.vuturevx.com/email_handler.aspx?sid=blankform&redirect=https:%2F%2Fwww.example.org%2Fen%2Flawyers&checksum=81AB12CD',
    )
    const expected = 'https://www.example.org/en/lawyers'

    expect(unwrapVuture(value)).toBe(expected)
  })

  it('should keep the percent-encoded query of the target', () => {
    const value = new URL(
      'https://connect.example.com/email_handler.aspx?sid=blankform&redirect=https%3a%2f%2fwww.example.org%2fViewDocument.aspx%3fd%3d1179130&checksum=07FB62D8',
    )
    const expected = 'https://www.example.org/ViewDocument.aspx?d=1179130'

    expect(unwrapVuture(value)).toBe(expected)
  })

  it('should return undefined for another path on the same host', () => {
    const value = new URL(
      'https://connect.example.com/login.aspx?redirect=https%3a%2f%2fwww.example.org%2f',
    )

    expect(unwrapVuture(value)).toBeUndefined()
  })

  it('should return undefined for another path under the api handler', () => {
    const value = new URL(
      'https://communications.example.com/api/email/unsubscribe?sid=blankform&redirect=https%3a%2f%2fwww.example.org%2f',
    )

    expect(unwrapVuture(value)).toBeUndefined()
  })

  it('should return undefined for the path under a directory', () => {
    const value = new URL(
      'https://connect.example.com/edit/email_handler.aspx?sid=blankform&redirect=https%3a%2f%2fwww.example.org%2f',
    )

    expect(unwrapVuture(value)).toBeUndefined()
  })

  it('should return undefined for a relative target', () => {
    const value = new URL(
      'https://connect.example.com/email_handler.aspx?sid=blankform&redirect=%2f9%2f6446%2flanding-pages%2frsvp-blank.asp',
    )

    expect(unwrapVuture(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'https://connect.example.com/email_handler.aspx?sid=blankform&redirect=mailto%3ainfo%40example.org',
    )

    expect(unwrapVuture(value)).toBeUndefined()
  })

  it('should return undefined when redirect param is missing', () => {
    const value = new URL('https://connect.example.com/email_handler.aspx?sid=blankform')

    expect(unwrapVuture(value)).toBeUndefined()
  })

  it('should return undefined when redirect param is empty', () => {
    const value = new URL('https://connect.example.com/email_handler.aspx?sid=blankform&redirect=')

    expect(unwrapVuture(value)).toBeUndefined()
  })
})
