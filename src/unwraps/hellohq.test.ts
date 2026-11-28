import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapHellohq } from './hellohq.js'

describe('unwrapHellohq', () => {
  it('should extract target from href param', () => {
    const value = new URL(
      'https://f3.hqlabs.de/Helper/LinkHelper.aspx?mailingId=3702060&key=a3da936aa0975ded54474203da4d109d255f9043&href=http%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapHellohq(value)).toBe(expected)
  })

  it('should extract target from href param on f4.hqlabs.de', () => {
    const value = new URL(
      'https://f4.hqlabs.de/Helper/LinkHelper.aspx?mailingId=2847766&href=https://www.example.com/',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapHellohq(value)).toBe(expected)
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://f4-hqlabs.de/Helper/LinkHelper.aspx?mailingId=2847766&href=https://www.example.com/',
    )

    expect(unwrapHellohq(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a numbered host', () => {
    const value = new URL(
      'https://f4.hqlabs.de.example.com/Helper/LinkHelper.aspx?mailingId=2847766&href=https://www.example.com/',
    )

    expect(unwrapHellohq(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with a numbered host', () => {
    const value = new URL(
      'https://mailf4.hqlabs.de/Helper/LinkHelper.aspx?mailingId=2847766&href=https://www.example.com/',
    )

    expect(unwrapHellohq(value)).toBeUndefined()
  })

  it('should return undefined when href param is missing', () => {
    const value = new URL(
      'https://f3.hqlabs.de/Helper/LinkHelper.aspx?mailingId=3702060&key=a3da936aa0975ded54474203da4d109d255f9043',
    )

    expect(unwrapHellohq(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'https://f3.hqlabs.de/Helper/OpenHelper.aspx?href=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapHellohq(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL(
      'https://example.com/Helper/LinkHelper.aspx?href=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapHellohq(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapHellohq)).toBe(true)
  })
})
