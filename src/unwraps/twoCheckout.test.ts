import { describe, expect, it } from 'bun:test'
import { unwrapTwoCheckout } from './twoCheckout.js'

describe('unwrapTwoCheckout', () => {
  it('should extract the target from a 2Checkout link', () => {
    const url = new URL(
      'https://secure.2checkout.com/affiliate.php?ACCOUNT=250288725771&AFFILIATE=135112&PATH=https%3A%2F%2Fexample.com%2Fangular%2F%3FAFFILIATE%3D135112',
    )

    expect(unwrapTwoCheckout(url)).toBe('https://example.com/angular/?AFFILIATE=135112')
  })

  it('should extract the target from an Avangate link', () => {
    const url = new URL(
      'https://secure.avangate.com/affiliate.php?ACCOUNT=EXLEVEL&AFFILIATE=99982&PATH=http%3A%2F%2Fexample.com',
    )

    expect(unwrapTwoCheckout(url)).toBe('http://example.com')
  })

  it('should extract the target from a merchant store host', () => {
    const url = new URL(
      'https://store.telestream.net/affiliate.php?ACCOUNT=TELESTRE&AFFILIATE=28826&PATH=http%3A%2F%2Fwww.example.net',
    )

    expect(unwrapTwoCheckout(url)).toBe('http://www.example.net')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://secure.avangate.com/affiliate.php?ACCOUNT=RNSOWE&AFFILIATE=40939&PATH=http://www.example.com/PhotoToMesh/Default.htm',
    )

    expect(unwrapTwoCheckout(url)).toBe('http://www.example.com/PhotoToMesh/Default.htm')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://secure.2checkout.com/affiliate.php?ACCOUNT=EXLEVEL&AFFILIATE=99982&PATH=http%253A%252F%252Fexample.com%252Fpage',
    )

    expect(unwrapTwoCheckout(url)).toBe('http://example.com/page')
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const url = new URL(
      'https://secure.2checkout.com/affiliate.php?ACCOUNT=EXLEVEL&AFFILIATE=99982&PATH=http%253A%252F%252Fexample.com%252F100%25',
    )

    expect(unwrapTwoCheckout(url)).toBe('http://example.com/100%')
  })

  it('should extract the target before AFFSRC', () => {
    const url = new URL(
      'https://secure.2checkout.com/affiliate.php?ACCOUNT=ALLAVSOF&AFFILIATE=147187&PATH=http%3A%2F%2Fwww.example.com%3FAFFILIATE%3D147187&AFFSRC=http%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapTwoCheckout(url)).toBe('http://www.example.com?AFFILIATE=147187')
  })

  it('should return undefined when ACCOUNT is missing', () => {
    const url = new URL(
      'https://store.example.com/affiliate.php?AFFILIATE=28826&PATH=http%3A%2F%2Fwww.example.net',
    )

    expect(unwrapTwoCheckout(url)).toBeUndefined()
  })

  it('should return undefined when AFFILIATE is missing', () => {
    const url = new URL(
      'https://store.example.com/affiliate.php?ACCOUNT=TELESTRE&PATH=http%3A%2F%2Fwww.example.net',
    )

    expect(unwrapTwoCheckout(url)).toBeUndefined()
  })

  it('should return undefined when PATH is missing', () => {
    const url = new URL(
      'https://secure.2checkout.com/affiliate.php?ACCOUNT=EXLEVEL&AFFILIATE=99982',
    )

    expect(unwrapTwoCheckout(url)).toBeUndefined()
  })

  it('should return undefined for a non-http PATH', () => {
    const url = new URL(
      'https://secure.2checkout.com/affiliate.php?ACCOUNT=EXLEVEL&AFFILIATE=99982&PATH=javascript%3Aalert(1)',
    )

    expect(unwrapTwoCheckout(url)).toBeUndefined()
  })

  it('should return undefined for an affiliate script with other params', () => {
    const url = new URL(
      'https://crm.example.com/affiliate.php?aff=3031&url=https://example.com/hosting',
    )

    expect(unwrapTwoCheckout(url)).toBeUndefined()
  })

  it('should return undefined for the shape under another path', () => {
    const url = new URL(
      'https://www.example.com/cart/affiliate.php?ACCOUNT=EXLEVEL&AFFILIATE=99982&PATH=http%3A%2F%2Fexample.org',
    )

    expect(unwrapTwoCheckout(url)).toBeUndefined()
  })

  it('should return undefined for the checkout page', () => {
    const url = new URL(
      'https://store.example.com/order/checkout.php?PRODS=4717920&AFFILIATE=49184&SHOPURL=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapTwoCheckout(url)).toBeUndefined()
  })
})
