import { describe, expect, it } from 'bun:test'
import { unwrapUkWebArchive } from './ukWebArchive.js'

describe('unwrapUkWebArchive', () => {
  it('should extract the target from a snapshot', () => {
    const url = new URL(
      'https://www.webarchive.org.uk/wayback/archive/20150401120000/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(url)).toBe('http://www.example.co.uk/about/')
  })

  it('should extract the target from a mp_ snapshot', () => {
    const url = new URL(
      'https://www.webarchive.org.uk/wayback/archive/20120502083322mp_/http://www.example.co.uk/report.pdf',
    )

    expect(unwrapUkWebArchive(url)).toBe('http://www.example.co.uk/report.pdf')
  })

  it('should extract the target from a snapshot under the language segment', () => {
    const url = new URL(
      'https://www.webarchive.org.uk/wayback/en/archive/20190110170142/https://www.example.co.uk/news/',
    )

    expect(unwrapUkWebArchive(url)).toBe('https://www.example.co.uk/news/')
  })

  it('should extract the target from a mp_ snapshot under the language segment', () => {
    const url = new URL(
      'https://www.webarchive.org.uk/wayback/en/archive/20190110170142mp_/https://www.example.co.uk/news/',
    )

    expect(unwrapUkWebArchive(url)).toBe('https://www.example.co.uk/news/')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://www.webarchive.org.uk/wayback/archive/20100811120000/http://www.example.co.uk/page.aspx?id=42#section',
    )

    expect(unwrapUkWebArchive(url)).toBe('http://www.example.co.uk/page.aspx?id=42#section')
  })

  it('should return undefined for a partial timestamp', () => {
    const url = new URL(
      'https://www.webarchive.org.uk/wayback/archive/3000/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a wildcard timestamp', () => {
    const url = new URL(
      'http://www.webarchive.org.uk/wayback/archive/20150401120000*/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://www.webarchive.org.uk/wayback/archive/20150401120000/ftp://example.co.uk/file.txt',
    )

    expect(unwrapUkWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://www.webarchive.org.uk/ukwa/archive/20150401120000/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/wayback/archive/20150401120000/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(url)).toBeUndefined()
  })
})
