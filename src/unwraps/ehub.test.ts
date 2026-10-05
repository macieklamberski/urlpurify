import { describe, expect, it } from 'bun:test'
import { unwrapEhub } from './ehub.js'

describe('unwrapEhub', () => {
  it('should extract a percent-encoded target from desturl param', () => {
    const url = new URL(
      'https://ehub.cz/system/scripts/click.php?a_aid=f3eb58ad&a_bid=a2d39c31&data1=jaktak&desturl=https%3A%2F%2Fwww.example.com%2Fshop%2F',
    )

    expect(unwrapEhub(url)).toBe('https://www.example.com/shop/')
  })

  it('should extract a plain target from desturl param', () => {
    const url = new URL(
      'https://ehub.cz/system/scripts/click.php?a_aid=2a5c2a3b&a_bid=a8c4ae05&data1=xqe&data2=oneblade&desturl=https://www.example.com/_EuwDAAW',
    )

    expect(unwrapEhub(url)).toBe('https://www.example.com/_EuwDAAW')
  })

  it('should return undefined when the target sits only in data1', () => {
    const url = new URL(
      'https://ehub.cz/system/scripts/click.php?a_aid=16f73639&a_bid=4fc84229&data1=https%3A%2F%2Fwww.example.com%2Ftituly%2F',
    )

    expect(unwrapEhub(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Ehub host', () => {
    const url = new URL(
      'https://ehub.cz/system/scripts/banner.php?desturl=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEhub(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/system/scripts/click.php?a_aid=1&desturl=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapEhub(url)).toBeUndefined()
  })
})
