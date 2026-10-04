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

    expect(unwrapCjNetwork(url)).toBe('https://www.example.com/Hotel_Review-g499380#REVIEWS')
  })

  it('should extract target after sid and fragment segments in the deep link path', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/8946794/type/dlg/sid/UUwpUdUnU57440/fragment/internal%3D1/https://www.example.com/search/',
    )

    expect(unwrapCjNetwork(url)).toBe('https://www.example.com/search/#internal=1')
  })

  it('should restore a collapsed scheme in the deep link path', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/100048247/type/dlg/sid/UUwpUdUnU57440/https:/www.example.com/?a_bid=48f95966',
    )

    expect(unwrapCjNetwork(url)).toBe('https://www.example.com/?a_bid=48f95966')
  })

  it('should decode a percent-encoded fragment segment into the target anchor', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/7768368/type/dlg/fragment/q%3Dsleepy%252Bcrib%26lang%3Den_US%26start%3D1/https://www.example.com/nursery/1043.html?dwvar_1043_color=100',
    )

    expect(unwrapCjNetwork(url)).toBe(
      'https://www.example.com/nursery/1043.html?dwvar_1043_color=100#q=sleepy%2Bcrib&lang=en_US&start=1',
    )
  })

  it('should keep the target anchor from the deep link path', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/100048247/type/dlg/sid/UUwpUdUnU84278/https://www.example.com/music/podcasts/portal/u/0#p:id=playpodcast/series&a=100923914',
    )

    expect(unwrapCjNetwork(url)).toBe(
      'https://www.example.com/music/podcasts/portal/u/0#p:id=playpodcast/series&a=100923914',
    )
  })

  it('should return undefined for the deep link path with a non-numeric publisher id', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/links/Verge/type/dlg/sid/VergeStreamingServiceDeals011223/https://www.example.com/plans/wireless/',
    )

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should return undefined for the deep link path below another path', () => {
    const url = new URL(
      'https://www.anrdoezrs.net/prefix/links/8946794/type/dlg/https://www.example.com/item',
    )

    expect(unwrapCjNetwork(url)).toBeUndefined()
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

  it('should extract target from a click link with a timestamp', () => {
    const url = new URL(
      'https://www.jdoqocy.com/click-12345-67890-1438649470000?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapCjNetwork(url)).toBe('https://example.com/page')
  })

  it('should extract target from a t path', () => {
    const url = new URL(
      'https://www.pntrs.com/t/8-11214-150797-146971?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapCjNetwork(url)).toBe('https://example.com/page')
  })

  it('should extract target from an opaque token path', () => {
    const url = new URL(
      'https://www.tkqlhce.com/8998xdmjdl02118A6572?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapCjNetwork(url)).toBe('https://example.com/page')
  })

  it('should return undefined for the url param on the root of a CJ host', () => {
    const url = new URL('https://www.dpbolvw.net/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should return undefined for the url param on a deeper path of a CJ host', () => {
    const url = new URL('https://www.dpbolvw.net/help/faq?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://exampledpbolvw.net/click-12345-67890?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should extract target from a click link with an unfilled publisher placeholder', () => {
    const url = new URL(
      'http://www.dpbolvw.net/click-{CJ_PID}-13223184?url=https://example.com/page',
    )

    expect(unwrapCjNetwork(url)).toBe('https://example.com/page')
  })

  it('should extract the deep link target on a bare domain no specimen shows', () => {
    const url = new URL('https://anrdoezrs.net/links/8946794/type/dlg/https://example.com/item')

    expect(unwrapCjNetwork(url)).toBe('https://example.com/item')
  })

  it('should return undefined for the deep link path on a lookalike host', () => {
    const url = new URL(
      'https://www.exampleanrdoezrs.net/links/8946794/type/dlg/https://example.org/item',
    )

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should extract target from the bare domain of a host the walk shows', () => {
    const url = new URL(
      'https://anrdoezrs.net/click-12345-67890?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapCjNetwork(url)).toBe('https://example.com/page')
  })

  it('should return undefined for the bare domain of an unlisted host', () => {
    const url = new URL(
      'https://dpbolvw.net/click-12345-67890?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL(
      'https://ad.kqzyfj.com/click-12345-67890?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapCjNetwork(url)).toBeUndefined()
  })
})
