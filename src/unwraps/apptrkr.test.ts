import { describe, expect, it } from 'bun:test'
import { cleanUrl } from '../clean.js'
import { unwrapApptrkr } from './apptrkr.js'

describe('unwrapApptrkr', () => {
  it('should extract target from targetURL param', () => {
    const value = new URL(
      'https://apptrkr.com/get_redirect.php?id=6544213&targetURL=https://www.example.edu/college/academics/mathematics',
    )
    const expected = 'https://www.example.edu/college/academics/mathematics'

    expect(unwrapApptrkr(value)).toBe(expected)
  })

  it('should extract target encoded once', () => {
    const value = new URL(
      'https://apptrkr.com/get_redirect.php?id=9757952&targetURL=http%3A%2F%2Fpathology.example.edu%2F',
    )
    const expected = 'http://pathology.example.edu/'

    expect(unwrapApptrkr(value)).toBe(expected)
  })

  it('should extract the inner target of an unencoded nested link', () => {
    const value = new URL(
      'https://apptrkr.com/get_redirect.php?id=6322795&targetURL=https://apptrkr.com/get_redirect.php?id=5134539&targetURL=http://www.example.edu/',
    )
    const expected = 'http://www.example.edu/'

    expect(unwrapApptrkr(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://apptrkr.com/get_redirect.php?id=7214040&targetURL=https://www.example.com/?term=Aherrahrou+R&sort=date',
    )
    const expected = 'https://www.example.com/?term=Aherrahrou+R'

    expect(unwrapApptrkr(value)).toBe(expected)
  })

  it('should extract target encoded twice', () => {
    const value = new URL(
      'https://apptrkr.com/get_redirect.php?id=9757952&targetURL=http%253A%252F%252Fpathology.example.edu%252F',
    )
    const expected = 'http://pathology.example.edu/'

    expect(unwrapApptrkr(value)).toBe(expected)
  })

  it('should extract target encoded twice with an uppercase scheme', () => {
    const value = new URL(
      'https://apptrkr.com/get_redirect.php?id=9757952&targetURL=HTTP%253A%252F%252Fpathology.example.edu%252F',
    )
    const expected = 'HTTP://pathology.example.edu/'

    expect(unwrapApptrkr(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://apptrkr.com/get_redirect.php?id=9757952&targetURL=http%253A%252F%252Fpathology.example.edu%252F100%25',
    )
    const expected = 'http://pathology.example.edu/100%'

    expect(unwrapApptrkr(value)).toBe(expected)
  })

  it('should keep the link for a non-http target', () => {
    const value = 'https://apptrkr.com/get_redirect.php?id=1&targetURL=mailto:jobs@example.edu'
    const expected = 'https://apptrkr.com/get_redirect.php?id=1&targetURL=mailto:jobs@example.edu'

    expect(cleanUrl(value, { unwrappers: [unwrapApptrkr] })).toBe(expected)
  })

  it('should return undefined when targetURL param is missing', () => {
    const value = new URL('https://apptrkr.com/get_redirect.php?id=1')

    expect(unwrapApptrkr(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://apptrkr.com/redirect.php?id=1&targetURL=https://example.com/job')

    expect(unwrapApptrkr(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/get_redirect.php?id=6544213&targetURL=https://example.org/job',
    )

    expect(unwrapApptrkr(value)).toBeUndefined()
  })
})
