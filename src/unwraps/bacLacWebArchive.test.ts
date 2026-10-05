import { describe, expect, it } from 'bun:test'
import { unwrapBacLacWebArchive } from './bacLacWebArchive.js'

describe('unwrapBacLacWebArchive', () => {
  it('should extract the target from a snapshot', () => {
    const url = new URL(
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/20240119052245/http://en.example.org/wiki/Reaction_formation',
    )

    expect(unwrapBacLacWebArchive(url)).toBe('http://en.example.org/wiki/Reaction_formation')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/20080207074351/http://www.example.ca/profiles/data.htm?id=98#table',
    )

    expect(unwrapBacLacWebArchive(url)).toBe('http://www.example.ca/profiles/data.htm?id=98#table')
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://webarchiveweb.wayback.bac-lac.canada.ca/web/20240119052245/')

    expect(unwrapBacLacWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/20240119052245/ftp://example.ca/file.txt',
    )

    expect(unwrapBacLacWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a partial timestamp', () => {
    const url = new URL(
      'https://webarchiveweb.wayback.bac-lac.canada.ca/web/2022/https://www.example.ca/',
    )

    expect(unwrapBacLacWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://webarchiveweb.wayback.bac-lac.canada.ca/search/20240119052245/http://www.example.ca/',
    )

    expect(unwrapBacLacWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://www.bac-lac.gc.ca/web/20240119052245/http://www.example.ca/')

    expect(unwrapBacLacWebArchive(url)).toBeUndefined()
  })
})
