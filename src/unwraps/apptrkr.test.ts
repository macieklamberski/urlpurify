import { describe, expect, it } from 'bun:test'
import { unwrapApptrkr } from './apptrkr.js'

describe('unwrapApptrkr', () => {
  it('should extract target from targetURL param', () => {
    const url = new URL(
      'https://apptrkr.com/get_redirect.php?id=6544213&targetURL=https://www.example.edu/college/academics/mathematics',
    )

    expect(unwrapApptrkr(url)).toBe('https://www.example.edu/college/academics/mathematics')
  })

  it('should extract target encoded once', () => {
    const url = new URL(
      'https://apptrkr.com/get_redirect.php?id=9757952&targetURL=http%3A%2F%2Fpathology.example.edu%2F',
    )

    expect(unwrapApptrkr(url)).toBe('http://pathology.example.edu/')
  })

  it('should extract the inner target of an unencoded nested link', () => {
    const url = new URL(
      'https://apptrkr.com/get_redirect.php?id=6322795&targetURL=https://apptrkr.com/get_redirect.php?id=5134539&targetURL=http://www.example.edu/',
    )

    expect(unwrapApptrkr(url)).toBe('http://www.example.edu/')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://apptrkr.com/get_redirect.php?id=7214040&targetURL=https://www.example.com/?term=Aherrahrou+R&sort=date',
    )

    expect(unwrapApptrkr(url)).toBe('https://www.example.com/?term=Aherrahrou+R')
  })

  it('should extract target encoded twice', () => {
    const url = new URL(
      'https://apptrkr.com/get_redirect.php?id=9757952&targetURL=http%253A%252F%252Fpathology.example.edu%252F',
    )

    expect(unwrapApptrkr(url)).toBe('http://pathology.example.edu/')
  })

  it('should extract target encoded twice with an uppercase scheme', () => {
    const url = new URL(
      'https://apptrkr.com/get_redirect.php?id=9757952&targetURL=HTTP%253A%252F%252Fpathology.example.edu%252F',
    )

    expect(unwrapApptrkr(url)).toBe('HTTP://pathology.example.edu/')
  })

  it('should return undefined when the twice-encoded target holds a malformed escape', () => {
    const url = new URL(
      'https://apptrkr.com/get_redirect.php?id=9757952&targetURL=http%253A%252F%252Fpathology.example.edu%252F%25E0%25A4%25A',
    )

    expect(unwrapApptrkr(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://apptrkr.com/get_redirect.php?id=1&targetURL=mailto:jobs@example.edu',
    )

    expect(unwrapApptrkr(url)).toBeUndefined()
  })

  it('should return undefined when targetURL param is missing', () => {
    const url = new URL('https://apptrkr.com/get_redirect.php?id=1')

    expect(unwrapApptrkr(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://apptrkr.com/redirect.php?id=1&targetURL=https://example.com/job')

    expect(unwrapApptrkr(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/get_redirect.php?id=6544213&targetURL=https://example.org/job',
    )

    expect(unwrapApptrkr(url)).toBeUndefined()
  })
})
