import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapNatlibNz } from './natlibNz.js'

describe('unwrapNatlibNz', () => {
  it('should give https to a target without a scheme', () => {
    const value =
      'https://ndhadeliver.natlib.govt.nz/webarchive/20200101000000/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapNatlibNz] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://ndhadeliver.natlib.govt.nz/webarchive/20200101000000/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapNatlibNz] })).toBe(expected)
  })

  it('should extract the target from a snapshot', () => {
    const url = new URL(
      'https://ndhadeliver.natlib.govt.nz/webarchive/20251113213257/https://www.example.govt.nz/meet-the-objects',
    )

    expect(unwrapNatlibNz(url)).toBe('https://www.example.govt.nz/meet-the-objects')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://ndhadeliver.natlib.govt.nz/webarchive/20190705140941/http://www.example.govt.nz/ArchivalSystem.do?id=1#results',
    )

    expect(unwrapNatlibNz(url)).toBe('http://www.example.govt.nz/ArchivalSystem.do?id=1#results')
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://ndhadeliver.natlib.govt.nz/webarchive/20251113213257/')

    expect(unwrapNatlibNz(url)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const url =
      'https://ndhadeliver.natlib.govt.nz/webarchive/20251113213257/ftp://example.org/file.txt'

    expect(purifyUrl(url, { unwrappers: [unwrapNatlibNz] })).toBe(url)
  })

  it('should return undefined for a partial timestamp', () => {
    const url = new URL(
      'https://ndhadeliver.natlib.govt.nz/webarchive/2014/http://www.example.govt.nz/',
    )

    expect(unwrapNatlibNz(url)).toBeUndefined()
  })

  it('should return undefined for the frame viewer', () => {
    const url = new URL(
      'http://ndhadeliver.natlib.govt.nz/ArcAggregator/arcView/frameView/IE12126512/http://www.example.govt.nz/',
    )

    expect(unwrapNatlibNz(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://natlib.govt.nz/webarchive/20251113213257/https://www.example.govt.nz/',
    )

    expect(unwrapNatlibNz(url)).toBeUndefined()
  })
})
