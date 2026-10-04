import { describe, expect, it } from 'bun:test'
import { cleanUrl } from '../clean.js'
import { unwrapArchiveToday } from './archiveToday.js'

const mirrorHosts = [
  'archive.is',
  'archive.ph',
  'archive.today',
  'archive.md',
  'archive.fo',
  'archive.vn',
  'archive.li',
  'www.archive.ph',
]

describe('unwrapArchiveToday', () => {
  it('should extract the target after a 14-digit timestamp', () => {
    const url = new URL('https://archive.ph/20240814014001/https://example.com/world/article')

    expect(unwrapArchiveToday(url)).toBe('https://example.com/world/article')
  })

  it('should extract the target after a dotted timestamp', () => {
    const url = new URL('http://archive.today/2021.06.12-193819/https://example.com/docs/page')

    expect(unwrapArchiveToday(url)).toBe('https://example.com/docs/page')
  })

  it('should extract the target from the link to the original', () => {
    const url = new URL('https://archive.is/o/hwFiP/https://example.com/coal')

    expect(unwrapArchiveToday(url)).toBe('https://example.com/coal')
  })

  it('should extract the target from the newest snapshot link', () => {
    const url = new URL('https://archive.is/newest/https://example.com/magazine/2025/41/page')

    expect(unwrapArchiveToday(url)).toBe('https://example.com/magazine/2025/41/page')
  })

  it.each(mirrorHosts)('should extract the target on %s', (host) => {
    const url = new URL(`https://${host}/20240814014001/https://example.com/page`)

    expect(unwrapArchiveToday(url)).toBe('https://example.com/page')
  })

  it('should keep the target query string and fragment', () => {
    const url = new URL('https://archive.is/20120917102258/https://example.com/a?id=5#section')

    expect(unwrapArchiveToday(url)).toBe('https://example.com/a?id=5#section')
  })

  it('should decode a target with an encoded scheme', () => {
    const url = new URL('https://archive.ph/2023.09.16-062709/https%3A//example.com/attention')

    expect(unwrapArchiveToday(url)).toBe('https://example.com/attention')
  })

  it('should keep the percent escapes of a target with a plain scheme', () => {
    const url = new URL('https://archive.ph/20240814014001/https://example.com/a%2Fb')

    expect(unwrapArchiveToday(url)).toBe('https://example.com/a%2Fb')
  })

  it('should treat a target with no scheme as http', () => {
    const url = new URL('http://archive.today/o/wpeDf/example.com/links.html')

    expect(unwrapArchiveToday(url)).toBe('http://example.com/links.html')
  })

  it('should return undefined for a short id with no target', () => {
    const url = new URL('https://archive.ph/AbCd1')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should return undefined for the bare host', () => {
    const url = new URL('https://archive.ph/')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should return undefined for the snapshot list of a url', () => {
    const url = new URL('https://archive.is/https://example.com/page')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should return undefined when the timestamp has the wrong digit count', () => {
    const url = new URL('https://archive.is/20120709/https://example.com/page')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://archive.ph/20240814014001/ftp://example.com/file')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should return undefined when the encoded target has malformed percent escapes', () => {
    const url = new URL('https://archive.ph/20240814014001/https%3A%ZZ')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://example.com/20240814014001/https://example.org/page')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should return undefined for an archive domain outside the mirror list', () => {
    const url = new URL('https://archive.org/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should restore an escaped query separator', () => {
    const url = new URL(
      'https://archive.is/20121211084659/http://www.example.com/people/search%3Flastname=Doe',
    )

    expect(unwrapArchiveToday(url)).toBe('http://www.example.com/people/search?lastname=Doe')
  })

  it('should restore an escaped fragment separator', () => {
    const url = new URL(
      'https://archive.is/o/NTGoD/https://www.example.com/standard%23:~:text=Congress',
    )

    expect(unwrapArchiveToday(url)).toBe('https://www.example.com/standard#:~:text=Congress')
  })

  it('should drop the snapshot highlight fragment', () => {
    const url = new URL(
      'https://archive.ph/20220919102213/https://example.com/news/article#selection-3608.0-3608.2',
    )

    expect(unwrapArchiveToday(url)).toBe('https://example.com/news/article')
  })

  it('should keep a highlight fragment followed by a text directive', () => {
    const url = new URL(
      'https://archive.ph/20220919102213/https://example.com/a#selection-1.0-1.5:~:text=word',
    )

    expect(unwrapArchiveToday(url)).toBe('https://example.com/a#selection-1.0-1.5:~:text=word')
  })

  it('should return undefined for a date-only dotted timestamp', () => {
    const url = new URL('https://archive.is/2026.06.28/https://example.com/page')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should extract the target from a subdomain no specimen shows', () => {
    const url = new URL('https://sub.archive.ph/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplearchive.ph/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should return undefined for a mirror host as a label of another host', () => {
    const url = new URL('https://archive.ph.example.com/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const url = new URL('https://archive.ph/x/20240814014001/https://example.com/page')

    expect(unwrapArchiveToday(url)).toBeUndefined()
  })

  it('should restore a lowercase escaped query separator', () => {
    const url = new URL(
      'https://archive.is/20121211084659/http://www.example.com/people/search%3flastname=Doe',
    )

    expect(unwrapArchiveToday(url)).toBe('http://www.example.com/people/search?lastname=Doe')
  })

  it('should restore only the first escaped query and fragment separators', () => {
    const url = new URL(
      'https://archive.is/20121211084659/http://www.example.com/search%3Fq=a%3Fb%23top%23x',
    )

    expect(unwrapArchiveToday(url)).toBe('http://www.example.com/search?q=a%3Fb#top%23x')
  })

  it('should unwrap through cleanUrl when passed as an unwrapper', () => {
    const value = 'https://archive.is/o/v8cfx/https:/www.example.com/us/story?utm_source=feed'

    expect(cleanUrl(value, { unwrappers: [unwrapArchiveToday] })).toBe(
      'https://www.example.com/us/story',
    )
  })
})
