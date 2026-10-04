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
