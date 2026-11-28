import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapperHosts } from '../utils.js'
import { unwrapArchiveToday } from './archiveToday.js'

describe('unwrapArchiveToday', () => {
  it('should repair a target the CMS spaced after its scheme', () => {
    const value = 'https://archive.ph/20200101000000/http://%20https://www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapArchiveToday] })).toBe(expected)
  })

  it('should extract the target after a 14-digit timestamp', () => {
    const value = new URL('https://archive.ph/20240814014001/https://example.com/world/article')
    const expected = 'https://example.com/world/article'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should extract the target after a dotted timestamp', () => {
    const value = new URL('http://archive.today/2021.06.12-193819/https://example.com/docs/page')
    const expected = 'https://example.com/docs/page'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should extract the target from the link to the original', () => {
    const value = new URL('https://archive.is/o/hwFiP/https://example.com/coal')
    const expected = 'https://example.com/coal'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should extract the target from the newest snapshot link', () => {
    const value = new URL('https://archive.is/newest/https://example.com/magazine/2025/41/page')
    const expected = 'https://example.com/magazine/2025/41/page'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should drop the query of the link after an encoded target', () => {
    const value = new URL(
      'https://archive.ph/20200101000000/https%3A%2F%2Fexample.com%2Fpage%3Fid%3D7?utm_source=rss',
    )
    const expected = 'https://example.com/page?id=7'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should keep the target query string and fragment', () => {
    const value = new URL('https://archive.is/20120917102258/https://example.com/a?id=5#section')
    const expected = 'https://example.com/a?id=5#section'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should decode a target with an encoded scheme', () => {
    const value = new URL('https://archive.ph/2023.09.16-062709/https%3A//example.com/attention')
    const expected = 'https://example.com/attention'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should keep the percent escapes of a target with a plain scheme', () => {
    const value = new URL('https://archive.ph/20240814014001/https://example.com/a%2Fb')
    const expected = 'https://example.com/a%2Fb'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should treat a target with no scheme as http', () => {
    const value = new URL('http://archive.today/o/wpeDf/example.com/links.html')
    const expected = 'http://example.com/links.html'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should treat a target with no scheme and a port as http', () => {
    const value = new URL('http://archive.today/o/wpeDf/www.example.com:8080/links.html')
    const expected = 'http://www.example.com:8080/links.html'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should return undefined for a short id with no target', () => {
    const value = new URL('https://archive.ph/AbCd1')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should return undefined for the bare host', () => {
    const value = new URL('https://archive.ph/')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should return undefined for the snapshot list of a url', () => {
    const value = new URL('https://archive.is/https://example.com/page')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should return undefined when the timestamp has the wrong digit count', () => {
    const value = new URL('https://archive.is/20120709/https://example.com/page')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://archive.ph/20240814014001/ftp://example.com/file'

    expect(purifyUrl(value, { unwrappers: [unwrapArchiveToday] })).toBe(value)
  })

  it('should keep the wrapper when the encoded target has malformed percent escapes', () => {
    const value = 'https://archive.ph/20240814014001/https%3A%ZZ'

    expect(purifyUrl(value, { unwrappers: [unwrapArchiveToday] })).toBe(value)
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL('https://example.com/20240814014001/https://example.org/page')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should return undefined for an archive domain outside the mirror list', () => {
    const value = new URL('https://archive.org/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should restore an escaped query separator', () => {
    const value = new URL(
      'https://archive.is/20121211084659/http://www.example.com/people/search%3Flastname=Doe',
    )
    const expected = 'http://www.example.com/people/search?lastname=Doe'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should restore an escaped fragment separator', () => {
    const value = new URL(
      'https://archive.is/o/NTGoD/https://www.example.com/standard%23:~:text=Congress',
    )
    const expected = 'https://www.example.com/standard#:~:text=Congress'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should drop the snapshot highlight fragment', () => {
    const value = new URL(
      'https://archive.ph/20220919102213/https://example.com/news/article#selection-3608.0-3608.2',
    )
    const expected = 'https://example.com/news/article'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should keep a highlight fragment followed by a text directive', () => {
    const value = new URL(
      'https://archive.ph/20220919102213/https://example.com/a#selection-1.0-1.5:~:text=word',
    )
    const expected = 'https://example.com/a#selection-1.0-1.5:~:text=word'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should return undefined for a date-only dotted timestamp', () => {
    const value = new URL('https://archive.is/2026.06.28/https://example.com/page')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplearchive.ph/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should return undefined for a mirror host as a label of another host', () => {
    const value = new URL('https://archive.ph.example.com/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const value = new URL('https://archive.ph/x/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should restore a lowercase escaped query separator', () => {
    const value = new URL(
      'https://archive.is/20121211084659/http://www.example.com/people/search%3flastname=Doe',
    )
    const expected = 'http://www.example.com/people/search?lastname=Doe'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should restore only the first escaped query and fragment separators', () => {
    const value = new URL(
      'https://archive.is/20121211084659/http://www.example.com/search%3Fq=a%3Fb%23top%23x',
    )
    const expected = 'http://www.example.com/search?q=a%3Fb#top%23x'

    expect(unwrapArchiveToday(value)).toBe(expected)
  })

  it('should unwrap through purifyUrl when passed as an unwrapper', () => {
    const value = 'https://archive.is/o/v8cfx/https:/www.example.com/us/story?fbclid=abc'
    const expected = 'https://www.example.com/us/story'

    expect(purifyUrl(value, { unwrappers: [unwrapArchiveToday] })).toBe(expected)
  })

  it('should return undefined for an unlisted subdomain of a mirror host', () => {
    const value = new URL('https://sub.archive.ph/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapArchiveToday)).toBe(true)
  })
})
