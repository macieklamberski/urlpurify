import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapArquivo } from './arquivo.js'

describe('unwrapArquivo', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://arquivo.pt/wayback/20200101000000/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapArquivo] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://arquivo.pt/wayback/20200101000000/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapArquivo] })).toBe(expected)
  })

  it('should extract the target from a snapshot', () => {
    const value = new URL(
      'http://arquivo.pt/wayback/20091001072715/http://www.example.com/disney/info/aladwsj.htm',
    )
    const expected = 'http://www.example.com/disney/info/aladwsj.htm'

    expect(unwrapArquivo(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://arquivo.pt/wayback/20090711025311/http://www.example.com/?p=734#comments',
    )
    const expected = 'http://www.example.com/?p=734#comments'

    expect(unwrapArquivo(value)).toBe(expected)
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('https://arquivo.pt/wayback/20091001072715/')

    expect(unwrapArquivo(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://arquivo.pt/wayback/20091001072715/ftp://example.com/file.txt'

    expect(purifyUrl(value, { unwrappers: [unwrapArquivo] })).toBe(value)
  })

  it('should return undefined for a partial timestamp', () => {
    const value = new URL('https://arquivo.pt/wayback/2009/http://www.example.com/')

    expect(unwrapArquivo(value)).toBeUndefined()
  })

  it('should return undefined for a doubled replay prefix', () => {
    const value = new URL(
      'http://arquivo.pt/wayback/wayback/20080208193937/http://www.example.pt/page',
    )

    expect(unwrapArquivo(value)).toBeUndefined()
  })

  it('should return undefined for the search page', () => {
    const value = new URL('https://arquivo.pt/search.jsp?query=http://www.example.pt/')

    expect(unwrapArquivo(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/wayback/20091001072715/http://www.example.org/')

    expect(unwrapArquivo(value)).toBeUndefined()
  })
})
