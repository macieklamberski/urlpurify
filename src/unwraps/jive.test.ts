import { describe, expect, it } from 'bun:test'
import { unwrapJive } from './jive.js'

describe('unwrapJive', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://community.example.com/external-link.jspa?url=http%3A%2F%2Fwww.example.org%2Ffiles%2Fdoc%2Fdata_sheet%2FKL36.pdf',
    )

    expect(unwrapJive(url)).toBe('http://www.example.org/files/doc/data_sheet/KL36.pdf')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://www.example.com/external-link.jspa?url=https%253A%252F%252Fexample.org%252Fpage',
    )

    expect(unwrapJive(url)).toBe('https://example.org/page')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://www.example.com/external-link.jspa?url=https://example.org/search/a+b',
    )

    expect(unwrapJive(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract an https target', () => {
    const url = new URL(
      'https://community.example.com/external-link.jspa?url=https%3A%2F%2Fdocs.example.org%2Fbackup%2Frecovery.html%23dr-infrastructure',
    )

    expect(unwrapJive(url)).toBe('https://docs.example.org/backup/recovery.html#dr-infrastructure')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://community.example.com/external-link.jspa?url=https://www.example.org/docs/builders/vmware-iso.html',
    )

    expect(unwrapJive(url)).toBe('https://www.example.org/docs/builders/vmware-iso.html')
  })

  it('should extract a target with a capitalised scheme', () => {
    const url = new URL(
      'https://community.example.com/external-link.jspa?url=Https%3A%2F%2Fcommunity.example.com%2Fthread%2F437034',
    )

    expect(unwrapJive(url)).toBe('Https://community.example.com/thread/437034')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'https://community.example.com/external-link.jspa?url=http%3A%2F%2Fcache.example.org%2Fdoc.pdf%3Ffpsp%3D1%26type%3DData%2520Sheets',
    )

    expect(unwrapJive(url)).toBe('http://cache.example.org/doc.pdf?fpsp=1&type=Data%20Sheets')
  })

  it('should extract the target on a host no specimen shows', () => {
    const url = new URL(
      'http://forum.example.net/external-link.jspa?url=http%3A%2F%2Fexample.org%2Fpage',
    )

    expect(unwrapJive(url)).toBe('http://example.org/page')
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL(
      'https://community.example.com/login.jspa?url=http%3A%2F%2Fexample.org%2Fpage',
    )

    expect(unwrapJive(url)).toBeUndefined()
  })

  it('should return undefined for the path under a context path', () => {
    const url = new URL(
      'https://community.example.com/community/external-link.jspa?url=http%3A%2F%2Fexample.org%2Fpage',
    )

    expect(unwrapJive(url)).toBeUndefined()
  })

  it('should return undefined for the path with a trailing slash', () => {
    const url = new URL(
      'https://community.example.com/external-link.jspa/?url=http%3A%2F%2Fexample.org%2Fpage',
    )

    expect(unwrapJive(url)).toBeUndefined()
  })

  it('should return undefined for a non-http url', () => {
    const url = new URL(
      'https://community.example.com/external-link.jspa?url=ftp%3A%2F%2Fexample.org%2Ffile',
    )

    expect(unwrapJive(url)).toBeUndefined()
  })

  it('should return undefined for a javascript url', () => {
    const url = new URL(
      'https://community.example.com/external-link.jspa?url=javascript%3Aalert(1)',
    )

    expect(unwrapJive(url)).toBeUndefined()
  })

  it('should return undefined for a relative url', () => {
    const url = new URL('https://community.example.com/external-link.jspa?url=%2Fthread%2F437034')

    expect(unwrapJive(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://community.example.com/external-link.jspa?other=value')

    expect(unwrapJive(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://community.example.com/external-link.jspa?url=')

    expect(unwrapJive(url)).toBeUndefined()
  })

  it('should return undefined when there is no query', () => {
    const url = new URL('https://community.example.com/external-link.jspa')

    expect(unwrapJive(url)).toBeUndefined()
  })
})
