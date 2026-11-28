import { describe, expect, it } from 'bun:test'
import { unwrapGoogleScholar } from './googleScholar.js'

describe('unwrapGoogleScholar', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://scholar.google.com/scholar_url?url=https%3A%2F%2Fcite.com%2Fpaper.pdf&hl=en',
    )
    const expected = 'https://cite.com/paper.pdf'

    expect(unwrapGoogleScholar(value)).toBe(expected)
  })

  it('should extract target from scholar.google.de host', () => {
    const value = new URL(
      'https://scholar.google.de/scholar_url?url=https%3A%2F%2Fcite.com%2Fpaper.pdf',
    )
    const expected = 'https://cite.com/paper.pdf'

    expect(unwrapGoogleScholar(value)).toBe(expected)
  })

  it('should extract target from scholar.google.co.uk host', () => {
    const value = new URL(
      'https://scholar.google.co.uk/scholar_url?url=https%3A%2F%2Fcite.com%2Fpaper.pdf',
    )
    const expected = 'https://cite.com/paper.pdf'

    expect(unwrapGoogleScholar(value)).toBe(expected)
  })

  it('should extract target from q param of an alert link', () => {
    const value = new URL(
      'http://scholar.google.pl/scholar_url?hl=en&q=http://www.example.net/publication/222709598_Social_preferences/file/72e7e525597be36d26.pdf&sa=X&scisig=AAGBfm0i53lprbIxEDWm4ZHkhVhOIIOh5w&oi=scholarr&ei=PGVGVPPFNonraL2mgegN&ved=0CB4QgAMoADAA',
    )
    const expected =
      'http://www.example.net/publication/222709598_Social_preferences/file/72e7e525597be36d26.pdf'

    expect(unwrapGoogleScholar(value)).toBe(expected)
  })

  it('should prefer url over q', () => {
    const value = new URL(
      'https://scholar.google.com/scholar_url?url=https%3A%2F%2Fcite.com%2Fpaper.pdf&q=https%3A%2F%2Fexample.org%2F',
    )
    const expected = 'https://cite.com/paper.pdf'

    expect(unwrapGoogleScholar(value)).toBe(expected)
  })

  it('should return undefined when url and q params are missing', () => {
    const value = new URL('https://scholar.google.com/scholar_url?hl=en')

    expect(unwrapGoogleScholar(value)).toBeUndefined()
  })

  it('should return undefined for non-/scholar_url paths', () => {
    const value = new URL('https://scholar.google.com/scholar?q=test')

    expect(unwrapGoogleScholar(value)).toBeUndefined()
  })

  it('should return undefined for non-Scholar hosts', () => {
    const value = new URL(
      'https://www.google.com/scholar_url?url=https%3A%2F%2Fcite.com%2Fpaper.pdf',
    )

    expect(unwrapGoogleScholar(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL(
      'https://www.scholar.google.com/scholar_url?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleScholar(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://notscholar.google.com/scholar_url?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleScholar(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path with the carrier param', () => {
    const value = new URL('https://scholar.google.com/scholar?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGoogleScholar(value)).toBeUndefined()
  })
})
