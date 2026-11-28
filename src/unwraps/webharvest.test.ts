import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapWebharvest } from './webharvest.js'

describe('unwrapWebharvest', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://webharvest.gov/peth04/20200101000000/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapWebharvest] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://webharvest.gov/peth04/20200101000000/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapWebharvest] })).toBe(expected)
  })

  it('should extract the target from a snapshot in an end-of-term collection', () => {
    const value = new URL(
      'https://webharvest.gov/peth04/20041020215226/http://www.example.mil/doctrine/jel/new_pubs/jp3_0.pdf',
    )
    const expected = 'http://www.example.mil/doctrine/jel/new_pubs/jp3_0.pdf'

    expect(unwrapWebharvest(value)).toBe(expected)
  })

  it('should extract the target from a snapshot in a congressional collection', () => {
    const value = new URL(
      'https://webharvest.gov/congress117th/20221225145025/https://www.example.gov/',
    )
    const expected = 'https://www.example.gov/'

    expect(unwrapWebharvest(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'http://webharvest.gov/peth04/20041105092332/http://www.example.gov/library/pubs.cfm?id=6#list',
    )
    const expected = 'http://www.example.gov/library/pubs.cfm?id=6#list'

    expect(unwrapWebharvest(value)).toBe(expected)
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('https://webharvest.gov/peth04/20041020215226/')

    expect(unwrapWebharvest(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://webharvest.gov/peth04/20041020215226/ftp://example.gov/file.txt'

    expect(purifyUrl(value, { unwrappers: [unwrapWebharvest] })).toBe(value)
  })

  it('should return undefined for a partial timestamp', () => {
    const value = new URL('https://webharvest.gov/peth04/2004/http://www.example.gov/')

    expect(unwrapWebharvest(value)).toBeUndefined()
  })

  it('should return undefined for another collection', () => {
    const value = new URL('https://webharvest.gov/search/20041020215226/http://www.example.gov/')

    expect(unwrapWebharvest(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/peth04/20041020215226/http://www.example.gov/')

    expect(unwrapWebharvest(value)).toBeUndefined()
  })
})
