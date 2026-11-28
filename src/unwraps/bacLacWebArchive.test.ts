import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapBacLacWebArchive } from './bacLacWebArchive.js'

describe('unwrapBacLacWebArchive', () => {
  it('should give https to a target without a scheme', () => {
    const value =
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/20200101000000/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapBacLacWebArchive] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/20200101000000/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapBacLacWebArchive] })).toBe(expected)
  })

  it('should extract the target from a snapshot', () => {
    const value = new URL(
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/20240119052245/http://en.example.org/wiki/Reaction_formation',
    )
    const expected = 'http://en.example.org/wiki/Reaction_formation'

    expect(unwrapBacLacWebArchive(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/20080207074351/http://www.example.ca/profiles/data.htm?id=98#table',
    )
    const expected = 'http://www.example.ca/profiles/data.htm?id=98#table'

    expect(unwrapBacLacWebArchive(value)).toBe(expected)
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('https://webarchiveweb.wayback.bac-lac.canada.ca/web/20240119052245/')

    expect(unwrapBacLacWebArchive(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value =
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/20240119052245/ftp://example.ca/file.txt'

    expect(purifyUrl(value, { unwrappers: [unwrapBacLacWebArchive] })).toBe(value)
  })

  it('should return undefined for a partial timestamp', () => {
    const value = new URL(
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/2022/https://www.example.ca/',
    )

    expect(unwrapBacLacWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://webarchiveweb.wayback.bac-lac.canada.ca/search/20240119052245/http://www.example.ca/',
    )

    expect(unwrapBacLacWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://www.bac-lac.gc.ca/web/20240119052245/http://www.example.ca/')

    expect(unwrapBacLacWebArchive(value)).toBeUndefined()
  })
})
