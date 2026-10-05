import { describe, expect, it } from 'bun:test'
import { unwrapWebcitation } from './webcitation.js'

describe('unwrapWebcitation', () => {
  it('should extract target from a snapshot id link', () => {
    const url = new URL(
      'https://www.webcitation.org/6LOgQeT6w?url=http://www.example.com/news/steve-jobs-57506/',
    )

    expect(unwrapWebcitation(url)).toBe('http://www.example.com/news/steve-jobs-57506/')
  })

  it('should extract target from a query link with a date', () => {
    const url = new URL(
      'http://www.webcitation.org/query?url=http://www.example.com/benunni/cf-7.rtf&date=2009-10-25+13:26:50',
    )

    expect(unwrapWebcitation(url)).toBe('http://www.example.com/benunni/cf-7.rtf')
  })

  it('should extract a percent-encoded target from a query link', () => {
    const url = new URL(
      'http://www.webcitation.org/query?url=http%3A%2F%2Fwww.example.com%2FData%2FORAC07.pdf',
    )

    expect(unwrapWebcitation(url)).toBe('http://www.example.com/Data/ORAC07.pdf')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://www.webcitation.org/6LOgQeT6w')

    expect(unwrapWebcitation(url)).toBeUndefined()
  })

  it('should return undefined for the archive request form', () => {
    const url = new URL(
      'http://www.webcitation.org/archive.php?url=http%3A%2F%2Fwww.example.com%2Fsearch',
    )

    expect(unwrapWebcitation(url)).toBeUndefined()
  })

  it('should return undefined for a snapshot id of another length', () => {
    const url = new URL('https://www.webcitation.org/6LOgQeT6?url=http://www.example.com/')

    expect(unwrapWebcitation(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/query?url=http://www.example.org/')

    expect(unwrapWebcitation(url)).toBeUndefined()
  })
})
