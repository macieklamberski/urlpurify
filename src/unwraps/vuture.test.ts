import { describe, expect, it } from 'bun:test'
import { unwrapVuture } from './vuture.js'

describe('unwrapVuture', () => {
  it('should extract target from redirect param', () => {
    const url = new URL(
      'https://connect.example.com/email_handler.aspx?sid=blankform&redirect=https%3a%2f%2fwww.example.org%2fen%2fpublications%2f2023%2f08%2fform-i9&checksum=1FC68932',
    )

    expect(unwrapVuture(url)).toBe('https://www.example.org/en/publications/2023/08/form-i9')
  })

  it('should extract the target on a recipient link without a checksum', () => {
    const url = new URL(
      'https://response.example.com/email_handler.aspx?sid=6df8526a-9fe3-4725-b3cc-09695e2949b2&redirect=https%3a%2f%2fwww.example.org%2fsubscribe%2f',
    )

    expect(unwrapVuture(url)).toBe('https://www.example.org/subscribe/')
  })

  it('should extract the target on a vendor host', () => {
    const url = new URL(
      'https://sites-example.vuturevx.com/email_handler.aspx?sid=blankform&redirect=http%3a%2f%2fwww.example.org%2fassets%2f690%2f683065.pdf',
    )

    expect(unwrapVuture(url)).toBe('http://www.example.org/assets/690/683065.pdf')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://news.example.com/email_handler.aspx?sid=blankform&redirect=https%253a%252f%252fwww.example.org%252ffact-sheets%252f17a-overtime&checksum=3B87DDF7',
    )

    expect(unwrapVuture(url)).toBe('https://www.example.org/fact-sheets/17a-overtime')
  })

  it('should extract a target with a slash-encoded scheme', () => {
    const url = new URL(
      'https://sites-example.vuturevx.com/email_handler.aspx?sid=blankform&redirect=https:%2F%2Fwww.example.org%2Fen%2Flawyers&checksum=81AB12CD',
    )

    expect(unwrapVuture(url)).toBe('https://www.example.org/en/lawyers')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'https://connect.example.com/email_handler.aspx?sid=blankform&redirect=https%3a%2f%2fwww.example.org%2fViewDocument.aspx%3fd%3d1179130&checksum=07FB62D8',
    )

    expect(unwrapVuture(url)).toBe('https://www.example.org/ViewDocument.aspx?d=1179130')
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL(
      'https://connect.example.com/login.aspx?redirect=https%3a%2f%2fwww.example.org%2f',
    )

    expect(unwrapVuture(url)).toBeUndefined()
  })

  it('should return undefined for the path under a directory', () => {
    const url = new URL(
      'https://connect.example.com/edit/email_handler.aspx?sid=blankform&redirect=https%3a%2f%2fwww.example.org%2f',
    )

    expect(unwrapVuture(url)).toBeUndefined()
  })

  it('should return undefined for a relative target', () => {
    const url = new URL(
      'https://connect.example.com/email_handler.aspx?sid=blankform&redirect=%2f9%2f6446%2flanding-pages%2frsvp-blank.asp',
    )

    expect(unwrapVuture(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://connect.example.com/email_handler.aspx?sid=blankform&redirect=mailto%3ainfo%40example.org',
    )

    expect(unwrapVuture(url)).toBeUndefined()
  })

  it('should return undefined when redirect param is missing', () => {
    const url = new URL('https://connect.example.com/email_handler.aspx?sid=blankform')

    expect(unwrapVuture(url)).toBeUndefined()
  })

  it('should return undefined when redirect param is empty', () => {
    const url = new URL('https://connect.example.com/email_handler.aspx?sid=blankform&redirect=')

    expect(unwrapVuture(url)).toBeUndefined()
  })
})
