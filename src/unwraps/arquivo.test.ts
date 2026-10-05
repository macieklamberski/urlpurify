import { describe, expect, it } from 'bun:test'
import { unwrapArquivo } from './arquivo.js'

describe('unwrapArquivo', () => {
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

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://arquivo.pt/wayback/20091001072715/ftp://example.com/file.txt')

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
