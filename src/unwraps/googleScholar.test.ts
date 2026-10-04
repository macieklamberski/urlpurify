import { describe, expect, it } from 'bun:test'
import { unwrapGoogleScholar } from './googleScholar.js'

describe('unwrapGoogleScholar', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://scholar.google.com/scholar_url?url=https%3A%2F%2Fcite.com%2Fpaper.pdf&hl=en',
    )

    expect(unwrapGoogleScholar(url)).toBe('https://cite.com/paper.pdf')
  })

  it('should extract target from scholar.google.de host', () => {
    const url = new URL(
      'https://scholar.google.de/scholar_url?url=https%3A%2F%2Fcite.com%2Fpaper.pdf',
    )

    expect(unwrapGoogleScholar(url)).toBe('https://cite.com/paper.pdf')
  })

  it('should extract target from scholar.google.co.uk host', () => {
    const url = new URL(
      'https://scholar.google.co.uk/scholar_url?url=https%3A%2F%2Fcite.com%2Fpaper.pdf',
    )

    expect(unwrapGoogleScholar(url)).toBe('https://cite.com/paper.pdf')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://scholar.google.com/scholar_url?hl=en')

    expect(unwrapGoogleScholar(url)).toBeUndefined()
  })

  it('should return undefined for non-/scholar_url paths', () => {
    const url = new URL('https://scholar.google.com/scholar?q=test')

    expect(unwrapGoogleScholar(url)).toBeUndefined()
  })

  it('should return undefined for non-Scholar hosts', () => {
    const url = new URL('https://www.google.com/scholar_url?url=https%3A%2F%2Fcite.com%2Fpaper.pdf')

    expect(unwrapGoogleScholar(url)).toBeUndefined()
  })

  it('should extract target from a subdomain no specimen shows', () => {
    const url = new URL(
      'https://www.scholar.google.com/scholar_url?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleScholar(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://notscholar.google.com/scholar_url?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleScholar(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path with the carrier param', () => {
    const url = new URL('https://scholar.google.com/scholar?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGoogleScholar(url)).toBeUndefined()
  })
})
