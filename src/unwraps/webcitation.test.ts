import { describe, expect, it } from 'bun:test'
import { unwrapWebcitation } from './webcitation.js'

describe('unwrapWebcitation', () => {
  it('should extract target from a snapshot id link', () => {
    const value = new URL(
      'https://www.webcitation.org/6LOgQeT6w?url=http://www.example.com/news/steve-jobs-57506/',
    )
    const expected = 'http://www.example.com/news/steve-jobs-57506/'

    expect(unwrapWebcitation(value)).toBe(expected)
  })

  it('should extract target from a query link with a date', () => {
    const value = new URL(
      'http://www.webcitation.org/query?url=http://www.example.com/benunni/cf-7.rtf&date=2009-10-25+13:26:50',
    )
    const expected = 'http://www.example.com/benunni/cf-7.rtf'

    expect(unwrapWebcitation(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from a query link', () => {
    const value = new URL(
      'http://www.webcitation.org/query?url=http%3A%2F%2Fwww.example.com%2FData%2FORAC07.pdf',
    )
    const expected = 'http://www.example.com/Data/ORAC07.pdf'

    expect(unwrapWebcitation(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://www.webcitation.org/6LOgQeT6w')

    expect(unwrapWebcitation(value)).toBeUndefined()
  })

  it('should return undefined for the archive request form', () => {
    const value = new URL(
      'http://www.webcitation.org/archive.php?url=http%3A%2F%2Fwww.example.com%2Fsearch',
    )

    expect(unwrapWebcitation(value)).toBeUndefined()
  })

  it('should return undefined for a snapshot id of another length', () => {
    const value = new URL('https://www.webcitation.org/6LOgQeT6?url=http://www.example.com/')

    expect(unwrapWebcitation(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/query?url=http://www.example.org/')

    expect(unwrapWebcitation(value)).toBeUndefined()
  })
})
