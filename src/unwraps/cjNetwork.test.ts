import { describe, expect, it } from 'bun:test'
import { unwrapCjNetwork } from './cjNetwork.js'

describe('unwrapCjNetwork', () => {
  it('should extract target from url param on dpbolvw.net', () => {
    const url = new URL(
      'https://www.dpbolvw.net/click-12345-67890?url=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapCjNetwork(url)).toBe('https://example.com/product')
  })

  it('should match other CJ network hosts', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/click-12345-67890?url=https%3A%2F%2Fexample.com%2Fitem',
    )

    expect(unwrapCjNetwork(url)).toBe('https://example.com/item')
  })

  it('should extract target from the deep link path', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/8946794/type/dlg/https://www.example.com/en-ca/books/item.html',
    )

    expect(unwrapCjNetwork(url)).toBe('https://www.example.com/en-ca/books/item.html')
  })

  it('should extract an http target from the deep link path', () => {
    const url = new URL(
      'http://www.anrdoezrs.net/links/7760579/type/dlg/http://www.example.com/products/',
    )

    expect(unwrapCjNetwork(url)).toBe('http://www.example.com/products/')
  })

  it('should keep the target query from the deep link path', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/100266590/type/dlg/https://example.com/product/throw-blanket?sku=s6-13300962',
    )

    expect(unwrapCjNetwork(url)).toBe('https://example.com/product/throw-blanket?sku=s6-13300962')
  })

  it('should extract target after a sid segment in the deep link path', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/7992675/type/dlg/sid/tordotcomgeneral/https://www.example.com/s/9781250750501',
    )

    expect(unwrapCjNetwork(url)).toBe('https://www.example.com/s/9781250750501')
  })

  it('should extract target after a fragment segment in the deep link path', () => {
    const url = new URL(
      'http://www.anrdoezrs.net/links/8919635/type/dlg/fragment/REVIEWS/https://www.example.com/Hotel_Review-g499380',
    )

    expect(unwrapCjNetwork(url)).toBe('https://www.example.com/Hotel_Review-g499380')
  })

  it('should extract target after sid and fragment segments in the deep link path', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/8946794/type/dlg/sid/UUwpUdUnU57440/fragment/internal%3D1/https://www.example.com/search/',
    )

    expect(unwrapCjNetwork(url)).toBe('https://www.example.com/search/')
  })

  it('should restore a collapsed scheme in the deep link path', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/100048247/type/dlg/sid/UUwpUdUnU57440/https:/www.example.com/?a_bid=48f95966',
    )

    expect(unwrapCjNetwork(url)).toBe('https://www.example.com/?a_bid=48f95966')
  })

  it('should return undefined for the deep link path without a target', () => {
    const url = new URL('https://www.anrdoezrs.net/links/8946794/type/dlg/')

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should return undefined for a link type other than dlg', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/8900337/type/am/https://www.example.com/w/item',
    )

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should return undefined for the links path without a link type', () => {
    const url = new URL('http://www.anrdoezrs.net/links/4302665/http://www.example.com/item.htm')

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should return undefined for the deep link path on non-CJ hosts', () => {
    const url = new URL('https://example.com/links/8946794/type/dlg/https://example.org/item')

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://www.tkqlhce.com/click-12345-67890')

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should return undefined for non-CJ hosts', () => {
    const url = new URL('https://example.com/click?url=https%3A%2F%2Fother.com')

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })
})
