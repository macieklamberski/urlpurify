import { describe, expect, it } from 'bun:test'
import { unwrapHellohq } from './hellohq.js'

describe('unwrapHellohq', () => {
  it('should extract target from href param', () => {
    const url = new URL(
      'https://f3.hqlabs.de/Helper/LinkHelper.aspx?mailingId=3702060&key=a3da936aa0975ded54474203da4d109d255f9043&href=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapHellohq(url)).toBe('http://www.example.com/')
  })

  it('should extract target from href param on f4.hqlabs.de', () => {
    const url = new URL(
      'https://f4.hqlabs.de/Helper/LinkHelper.aspx?mailingId=2847766&href=https://www.example.com/',
    )

    expect(unwrapHellohq(url)).toBe('https://www.example.com/')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://f4-hqlabs.de/Helper/LinkHelper.aspx?mailingId=2847766&href=https://www.example.com/',
    )

    expect(unwrapHellohq(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a numbered host', () => {
    const url = new URL(
      'https://f4.hqlabs.de.example.com/Helper/LinkHelper.aspx?mailingId=2847766&href=https://www.example.com/',
    )

    expect(unwrapHellohq(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with a numbered host', () => {
    const url = new URL(
      'https://mailf4.hqlabs.de/Helper/LinkHelper.aspx?mailingId=2847766&href=https://www.example.com/',
    )

    expect(unwrapHellohq(url)).toBeUndefined()
  })

  it('should return undefined when href param is missing', () => {
    const url = new URL(
      'https://f3.hqlabs.de/Helper/LinkHelper.aspx?mailingId=3702060&key=a3da936aa0975ded54474203da4d109d255f9043',
    )

    expect(unwrapHellohq(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://f3.hqlabs.de/Helper/OpenHelper.aspx?href=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapHellohq(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL(
      'https://example.com/Helper/LinkHelper.aspx?href=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapHellohq(url)).toBeUndefined()
  })
})
