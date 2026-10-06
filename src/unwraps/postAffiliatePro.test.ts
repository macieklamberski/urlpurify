import { describe, expect, it } from 'bun:test'
import { unwrapEhub } from './ehub.js'
import { unwrapPostAffiliatePro } from './postAffiliatePro.js'

describe('unwrapPostAffiliatePro', () => {
  it('should extract a percent-encoded target from desturl param', () => {
    const url = new URL(
      'https://affiliate.example.com/scripts/click.php?a_aid=4f665e0d06268&a_bid=04d73170&desturl=https%3A%2F%2Fwww.example.com%2Fpt',
    )

    expect(unwrapPostAffiliatePro(url)).toBe('https://www.example.com/pt')
  })

  it('should extract a plain target under an install folder', () => {
    const url = new URL(
      'http://www.example.com/aff/scripts/click.php?a_aid=petrmara&a_bid=5e96b67b&desturl=http://www.example.com/packages.shtml',
    )

    expect(unwrapPostAffiliatePro(url)).toBe('http://www.example.com/packages.shtml')
  })

  it('should extract the target under a nested install folder', () => {
    const url = new URL(
      'http://www.example.com/affiliate/pap/scripts/click.php?blpid=4c5c574585287&a_bid=24db2e79&desturl=http://www.example.com/product/Canon_50mm_1.4',
    )

    expect(unwrapPostAffiliatePro(url)).toBe('http://www.example.com/product/Canon_50mm_1.4')
  })

  it('should keep the percent-encoded query and fragment of the target', () => {
    const url = new URL(
      'http://affiliate.example.com/scripts/click.php?a_aid=55325c3c&desturl=https%3A%2F%2Fdesigners.example.com%2F%3Futm_medium%3Daffiliate%23%2Fdesign%2F5c58de68312e12536b3f93f0',
    )

    expect(unwrapPostAffiliatePro(url)).toBe(
      'https://designers.example.com/?utm_medium=affiliate#/design/5c58de68312e12536b3f93f0',
    )
  })

  it('should extract the target with a ref_id affiliate id', () => {
    const url = new URL(
      'http://ref.example.com/scripts/click.php?ref_id=nichol54&desturl=https://www.example.com/',
    )

    expect(unwrapPostAffiliatePro(url)).toBe('https://www.example.com/')
  })

  it('should extract the target with a k_id affiliate id', () => {
    const url = new URL(
      'https://konga.example.com/scripts/click.php?k_id=9janinja&desturl=https://www.example.com/',
    )

    expect(unwrapPostAffiliatePro(url)).toBe('https://www.example.com/')
  })

  it('should extract the target with tag and bid params', () => {
    const url = new URL(
      'http://partner.example.com/scripts/click.php?tag=5e3c70116c171&bid=8a46118c&desturl=http://www.example.com/',
    )

    expect(unwrapPostAffiliatePro(url)).toBe('http://www.example.com/')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://affiliate.example.com/scripts/click.php?a_aid=1&desturl=https%253A%252F%252Fwww.example.com%252Fbook',
    )

    expect(unwrapPostAffiliatePro(url)).toBe('https://www.example.com/book')
  })

  it('should return the same target as unwrapEhub on an Ehub link', () => {
    const url = new URL(
      'https://ehub.cz/system/scripts/click.php?a_aid=f3eb58ad&a_bid=a2d39c31&data1=jaktak&desturl=https%3A%2F%2Fwww.example.com%2Fshop%2F',
    )

    expect(unwrapPostAffiliatePro(url)).toBe('https://www.example.com/shop/')
    expect(unwrapPostAffiliatePro(url)).toBe(unwrapEhub(url))
  })

  it('should return undefined for another script on scripts/click.php', () => {
    const url = new URL(
      'http://www.example.com/scripts/click.php?qxaid=1&clickTAG=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPostAffiliatePro(url)).toBeUndefined()
  })

  it('should return undefined for click.php outside a scripts folder', () => {
    const url = new URL(
      'https://www.example.com/affiliate/click.php?a_aid=1&desturl=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPostAffiliatePro(url)).toBeUndefined()
  })

  it('should return undefined for a folder that only ends with scripts', () => {
    const url = new URL(
      'https://www.example.com/myscripts/click.php?a_aid=1&desturl=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPostAffiliatePro(url)).toBeUndefined()
  })

  it('should return undefined for a path that continues after click.php', () => {
    const url = new URL(
      'https://affiliate.example.com/scripts/click.php/extra?a_aid=1&desturl=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPostAffiliatePro(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://affiliate.example.com/scripts/click.php?a_aid=1&desturl=javascript%3Aalert(1)',
    )

    expect(unwrapPostAffiliatePro(url)).toBeUndefined()
  })

  it('should return undefined when desturl is empty', () => {
    const url = new URL('https://affiliate.example.com/scripts/click.php?a_aid=1&desturl=')

    expect(unwrapPostAffiliatePro(url)).toBeUndefined()
  })

  it('should return undefined when desturl is missing', () => {
    const url = new URL('https://affiliate.example.com/scripts/click.php?a_aid=1&a_bid=2&data1=x')

    expect(unwrapPostAffiliatePro(url)).toBeUndefined()
  })
})
