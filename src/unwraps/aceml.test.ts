import { describe, expect, it } from 'bun:test'
import { unwrapAceml } from './aceml.js'

describe('unwrapAceml', () => {
  it('should decode a base64 redirectUrl param', () => {
    const target = 'https://example.com/article'
    const encoded = Buffer.from(target).toString('base64')
    const url = new URL(
      `https://abc.acemlna.com/Prod/link-tracker?notrack=1&redirectUrl=${encodeURIComponent(encoded)}`,
    )

    expect(unwrapAceml(url)).toBe(target)
  })

  it('should decode a base64 redirectUrl param holding a percent-encoded target', () => {
    const url = new URL(
      'https://example.lt.acemlnc.com/Prod/link-tracker?redirectUrl=aHR0cHMlM0ElMkYlMkZleGFtcGxlLmNvbSUyRmVkaXRvJTNGaWQlM0Qx&sig=25aVrhcnNbnaNWYVHMVds7Q6enE',
    )

    expect(unwrapAceml(url)).toBe('https://example.com/edito?id=1')
  })

  it('should return a plain redirectUrl param', () => {
    const url = new URL(
      'https://example.lt.acemlnb.com/Prod/link-tracker?redirectUrl=https://example.com/terms/a/annualized-rate.asp&a=90105704&s=192ad911b220e2320a3c7e3da8b45b6e&i=77A73A1A506',
    )

    expect(unwrapAceml(url)).toBe('https://example.com/terms/a/annualized-rate.asp')
  })

  it('should return undefined when the percent-encoded target is malformed', () => {
    const encoded = Buffer.from('https%3A%2F%2Fexample.com%2F%E0%A4%A').toString('base64')
    const url = new URL(
      `https://abc.acemlnc.com/Prod/link-tracker?redirectUrl=${encodeURIComponent(encoded)}`,
    )

    expect(unwrapAceml(url)).toBeUndefined()
  })

  it('should match other ACEML host suffixes', () => {
    const target = 'https://example.com/page'
    const encoded = Buffer.from(target).toString('base64')
    const url = new URL(
      `https://xyz.acemlnd.com/Prod/link-tracker?redirectUrl=${encodeURIComponent(encoded)}`,
    )

    expect(unwrapAceml(url)).toBe(target)
  })

  it('should return undefined when the decoded value is not http(s)', () => {
    const encoded = Buffer.from('not-a-url').toString('base64')
    const url = new URL(
      `https://abc.acemlna.com/Prod/link-tracker?redirectUrl=${encodeURIComponent(encoded)}`,
    )

    expect(unwrapAceml(url)).toBeUndefined()
  })

  it('should return undefined when redirectUrl is missing', () => {
    const url = new URL('https://abc.acemlna.com/Prod/link-tracker?notrack=1')

    expect(unwrapAceml(url)).toBeUndefined()
  })

  it('should return undefined for non-tracker paths', () => {
    const url = new URL(
      'https://abc.acemlna.com/redirect?redirectUrl=aHR0cHM6Ly9leGFtcGxlLmNvbS8%3D',
    )

    expect(unwrapAceml(url)).toBeUndefined()
  })

  it('should return undefined for non-ACEML hosts', () => {
    const url = new URL(
      'https://example.com/Prod/link-tracker?redirectUrl=aHR0cHM6Ly9leGFtcGxlLmNvbS8%3D',
    )

    expect(unwrapAceml(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://exampleacemlna.com/Prod/link-tracker?redirectUrl=aHR0cHM6Ly9leGFtcGxlLmNvbS8%3D',
    )

    expect(unwrapAceml(url)).toBeUndefined()
  })

  it('should return undefined for the bare domain', () => {
    const url = new URL(
      'https://acemlnb.com/Prod/link-tracker?redirectUrl=aHR0cHM6Ly9leGFtcGxlLmNvbS8%3D',
    )

    expect(unwrapAceml(url)).toBeUndefined()
  })
})
