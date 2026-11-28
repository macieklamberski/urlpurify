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
    const url = new URL(
      'http://arquivo.pt/wayback/20091001072715/http://www.example.com/disney/info/aladwsj.htm',
    )

    expect(unwrapArquivo(url)).toBe('http://www.example.com/disney/info/aladwsj.htm')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://arquivo.pt/wayback/20090711025311/http://www.example.com/?p=734#comments',
    )

    expect(unwrapArquivo(url)).toBe('http://www.example.com/?p=734#comments')
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://arquivo.pt/wayback/20091001072715/')

    expect(unwrapArquivo(url)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const url = 'https://arquivo.pt/wayback/20091001072715/ftp://example.com/file.txt'

    expect(purifyUrl(url, { unwrappers: [unwrapArquivo] })).toBe(url)
  })

  it('should return undefined for a partial timestamp', () => {
    const url = new URL('https://arquivo.pt/wayback/2009/http://www.example.com/')

    expect(unwrapArquivo(url)).toBeUndefined()
  })

  it('should return undefined for a doubled replay prefix', () => {
    const url = new URL(
      'http://arquivo.pt/wayback/wayback/20080208193937/http://www.example.pt/page',
    )

    expect(unwrapArquivo(url)).toBeUndefined()
  })

  it('should return undefined for the search page', () => {
    const url = new URL('https://arquivo.pt/search.jsp?query=http://www.example.pt/')

    expect(unwrapArquivo(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/wayback/20091001072715/http://www.example.org/')

    expect(unwrapArquivo(url)).toBeUndefined()
  })
})
