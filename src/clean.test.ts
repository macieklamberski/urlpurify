import { describe, expect, it } from 'bun:test'
import { decodeBase64 } from 'trousse'
import { cleanUrl, isTrackingParam, stripTrackingParams, unwrapUrl } from './clean.js'
import { campaignParams, defaultTrackingParams, housekeepingParams } from './defaults.js'
import type { TrackingParam, TrackingValueTest, UrlUnwrapper } from './types.js'
import { unwrapWebArchive } from './unwraps/webArchive.js'
import { createParamExtractor } from './utils.js'

const exampleUnwrapper = createParamExtractor({
  hosts: 'redirect.example.com',
  params: ['target'],
})

const exampleFallbackUnwrapper = createParamExtractor({
  hosts: 'redirect.example.com',
  params: ['fallback'],
})

const nestedUnwrapper = createParamExtractor({
  hosts: 'outer.example.com',
  params: ['url'],
})

// A base64 carrier holding the raw bytes of a legacy-charset target.
const base64Unwrapper: UrlUnwrapper = (url) => {
  if (url.hostname !== 'base64.example.com') {
    return
  }

  return decodeBase64(url.searchParams.get('u') ?? '')
}

const sessionParamRegex = /^session_[a-z]$/
const emptyRegex = /^$/
const longHexRegex = /^[0-9a-f]{32}$/
const everyNameRegex = /^/
const exceptIdRegex = /^(?!id$)/
const shopHostRegex = /(^|\.)shop\.example$/
const utmFamilyRegex = /^utm_[a-z0-9_-]+$/

describe('unwrapUrl', () => {
  it('should return the target from the matching unwrapper', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fpost'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value, [nestedUnwrapper, exampleUnwrapper])).toBe(expected)
  })

  it('should return the first match when multiple unwrappers match', () => {
    const value =
      'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Ffirst&fallback=https%3A%2F%2Fexample.com%2Fsecond'
    const expected = 'https://example.com/first'

    expect(unwrapUrl(value, [exampleUnwrapper, exampleFallbackUnwrapper])).toBe(expected)
  })

  it('should unwrap with default unwrappers when none are given', () => {
    const value = 'https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpost'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value)).toBe(expected)
  })

  it('should unwrap a wrapper whose path opens on a doubled slash', () => {
    const value = 'https://www.linkedin.com//safety/go?url=https%3A%2F%2Fexample.com%2Fpost'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value)).toBe(expected)
  })

  it('should unwrap a wrapper with a doubled slash inside its path', () => {
    const value = 'https://www.linkedin.com/safety//go?url=https%3A%2F%2Fexample.com%2Fpost'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value)).toBe(expected)
  })

  it('should keep a doubled slash in the path of the target', () => {
    const value = 'https://www.linkedin.com/safety/go?url=https%3A%2F%2Fexample.com%2Fa%2F%2Fpost'
    const expected = 'https://example.com/a//post'

    expect(unwrapUrl(value)).toBe(expected)
  })

  it('should unwrap a wrapper with a doubled slash that carries its target in the path', () => {
    const value = 'https://web.archive.org//web/20240101120000/https://example.com/page'
    const expected = 'https://example.com/page'

    expect(unwrapUrl(value, [unwrapWebArchive])).toBe(expected)
  })

  it('should return the target in the URL Standard serialization', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2FEXAMPLE.com%2Fpost'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe(expected)
  })

  it('should return undefined when no unwrapper matches', () => {
    const value = 'https://example.com/post'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBeUndefined()
  })

  it('should return undefined for an empty unwrapper list', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com'

    expect(unwrapUrl(value, [])).toBeUndefined()
  })

  it('should return undefined when the input is not a valid URL', () => {
    expect(unwrapUrl('not a url', [exampleUnwrapper])).toBeUndefined()
  })

  it('should repair a target with a single slash after the scheme', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2Fexample.com%2Fpost'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe(expected)
  })

  it('should give a protocol-relative target the https scheme', () => {
    const value = 'https://redirect.example.com/?target=%2F%2Fexample.com%2Fembed.html'
    const expected = 'https://example.com/embed.html'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe(expected)
  })

  it('should give a target without a scheme the https scheme', () => {
    const value =
      'https://redirect.example.com/?target=www%2Eexample%2Ecom%2Fdominican-republic%2Fd32-ttd'
    const expected = 'https://www.example.com/dominican-republic/d32-ttd'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe(expected)
  })

  it('should give a bare host target the https scheme', () => {
    const value = 'https://redirect.example.com/?target=example.com'
    const expected = 'https://example.com/'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe(expected)
  })

  it('should return undefined for a target without a scheme or a dotted host', () => {
    const value = 'https://redirect.example.com/?target=relative%2Fpath'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBeUndefined()
  })

  it('should return undefined for a target naming another scheme', () => {
    const value = 'https://redirect.example.com/?target=mailto%3Aname%40example.com'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBeUndefined()
  })

  it('should drop the space between a prefixed scheme and the target', () => {
    const value =
      'https://redirect.example.com/?target=http%3A%2F%2F%2520www.instagram.com%2Fiankoniak%2F'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe('http://www.instagram.com/iankoniak/')
  })

  it('should drop a prefixed scheme and the space before the scheme of the target', () => {
    const value =
      'https://redirect.example.com/?target=http%3A%2F%2F+https%3A%2F%2Fgive.sams-usa.org%2F'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe('https://give.sams-usa.org/')
  })

  it('should drop a no-break space after a prefixed scheme', () => {
    const value =
      'https://redirect.example.com/?target=http%3A%2F%2F%C2%A0https%3A%2F%2Fwww.theclairco.com%2F'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe('https://www.theclairco.com/')
  })

  it('should repair a scheme typo in the target before the http check', () => {
    const value =
      'https://redirect.example.com/?target=hthttps%3A%2F%2Faudiomack.com%2Fcharles-menut%2Fsong%2Fross-wilson'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe(
      'https://audiomack.com/charles-menut/song/ross-wilson',
    )
  })

  it('should trim a no-break space after the target', () => {
    const value = 'https://redirect.example.com/?target=http%3A%2F%2Fwww.example.com%C2%A0%C2%A0'
    const expected = 'http://www.example.com/'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe(expected)
  })

  it('should return undefined for a target opening with three slashes', () => {
    const value = 'https://redirect.example.com/?target=%2F%2F%2Fexample.com%2Fpost'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBeUndefined()
  })

  it('should return undefined for a root-relative target', () => {
    const value = 'https://redirect.example.com/?target=%2Frelative%2Fpath'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBeUndefined()
  })

  it('should trim whitespace around the target', () => {
    const value = 'https://redirect.example.com/?target=%20https%3A%2F%2Fexample.com%2Fpost%0A'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe(expected)
  })

  it('should return undefined for a target with a control character', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fa%0D%0Ab'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBeUndefined()
  })

  it('should keep a legacy-charset escape in the target as written', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2F%A4%A2'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe('https://example.com/%A4%A2')
  })

  it('should keep a legacy-charset byte of a base64 target as an escape', () => {
    const value = 'https://base64.example.com/?u=aHR0cHM6Ly9leGFtcGxlLmNvbS%2Bkog%3D%3D'

    expect(unwrapUrl(value, [base64Unwrapper])).toBe('https://example.com/%A4%A2')
  })

  it('should skip a javascript: target', () => {
    const value = 'https://l.facebook.com/l.php?u=javascript:alert(1)'

    expect(unwrapUrl(value)).toBeUndefined()
  })

  it('should skip a data: target', () => {
    const value = 'https://www.google.com/url?q=data:text/html,%3Cscript%3E%3C/script%3E'

    expect(unwrapUrl(value)).toBeUndefined()
  })

  it('should skip a target that is not a URL', () => {
    const value = 'https://www.google.com/url?q=hello+world'

    expect(unwrapUrl(value)).toBeUndefined()
  })

  it('should fall through to the next unwrapper when a target is not http', () => {
    const value =
      'https://redirect.example.com/?target=javascript:alert(1)&fallback=https://example.com/post'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value, [exampleUnwrapper, exampleFallbackUnwrapper])).toBe(expected)
  })

  it('should fall through to the next unwrapper when a target is ftp', () => {
    const value =
      'https://redirect.example.com/?target=ftp://example.org/file&fallback=https://example.com/post'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value, [exampleUnwrapper, exampleFallbackUnwrapper])).toBe(expected)
  })

  it('should fall through to the next unwrapper when a target has no usable host', () => {
    const value =
      'https://redirect.example.com/?target=https://www.&fallback=https://example.com/post'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value, [exampleUnwrapper, exampleFallbackUnwrapper])).toBe(expected)
  })
})

describe('stripTrackingParams', () => {
  it('should remove matching params', () => {
    const value = 'https://example.com/post?utm_source=feed&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, ['utm_source'])).toBe(expected)
  })

  it('should remove multiple matching params at once', () => {
    const value = 'https://example.com/post?utm_source=feed&utm_medium=email&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, ['utm_source', 'utm_medium'])).toBe(expected)
  })

  it('should remove default params when none are given', () => {
    const value = 'https://example.com/post?fbclid=abc&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should match param names case-insensitively', () => {
    const value = 'https://example.com/post?UTM_Source=feed&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, ['utm_source'])).toBe(expected)
  })

  it('should remove the query separator when all params are stripped', () => {
    const value = 'https://example.com/post?utm_source=feed'
    const expected = 'https://example.com/post'

    expect(stripTrackingParams(value, ['utm_source'])).toBe(expected)
  })

  it('should preserve the fragment', () => {
    const value = 'https://example.com/post?utm_source=feed#section'
    const expected = 'https://example.com/post#section'

    expect(stripTrackingParams(value, ['utm_source'])).toBe(expected)
  })

  it('should return a serialized URL unchanged when nothing matches', () => {
    const value = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, ['utm_source'])).toBe(value)
  })

  it('should serialize the URL when nothing matches', () => {
    const value = 'https://EXAMPLE.com/post?id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, ['utm_source'])).toBe(expected)
  })

  it('should return the input unchanged for an empty param list', () => {
    const value = 'https://example.com/post?utm_source=feed'

    expect(stripTrackingParams(value, [])).toBe(value)
  })

  it('should return the input unchanged when there is no query', () => {
    const value = 'https://example.com/post'

    expect(stripTrackingParams(value, ['utm_source'])).toBe(value)
  })

  it('should return the input unchanged when it is not a valid URL', () => {
    expect(stripTrackingParams('not a url')).toBe('not a url')
  })

  it('should remove params matching default patterns', () => {
    const value = 'https://example.com/post?hsa_id=abc123&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should match patterns against lowercased names', () => {
    const value = 'https://example.com/post?HSA_ID=abc123&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should accept regex entries in a custom list', () => {
    const value = 'https://example.com/post?session_a=1&session_b=2&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, [sessionParamRegex])).toBe(expected)
  })

  it('should accept mixed literal and regex entries', () => {
    const value = 'https://example.com/post?fbclid=abc&utm_extra=1&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, ['fbclid', utmFamilyRegex])).toBe(expected)
  })

  it('should keep campaign tags by default', () => {
    const value = 'https://example.com/post?utm_source=feed&utm_medium=rss'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep affiliate params by default', () => {
    const value = 'https://example.com/product?awc=12345_1700000000_abc'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should strip utm_cid by default, which carries a client id', () => {
    const value = 'https://example.com/post?utm_source=feed&utm_cid=1234.5678'
    const expected = 'https://example.com/post?utm_source=feed'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should strip campaign tags when campaignParams is added to the defaults', () => {
    const value = 'https://example.com/post?utm_source=feed&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, [...defaultTrackingParams, ...campaignParams])).toBe(expected)
  })

  it('should keep cid, which carries functional IDs', () => {
    const value = 'https://www.google.com/maps?cid=1234567890'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should not match anchored patterns inside longer names', () => {
    const value = 'https://example.com/post?xhsa_kwy=1'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep a valueless param as written', () => {
    const value = 'https://example.com/post?flag&fbclid=abc'
    const expected = 'https://example.com/post?flag'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep an empty pair as written', () => {
    const value = 'https://example.com/post?a=1&&fbclid=abc'
    const expected = 'https://example.com/post?a=1&'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep the encoding of the remaining params', () => {
    const value = 'https://example.com/get?file=my%20doc.pdf&q=a+b&fbclid=abc'
    const expected = 'https://example.com/get?file=my%20doc.pdf&q=a+b'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep semicolon-separated values as written', () => {
    const value = 'https://example.com/post?a=1;b=2&fbclid=abc'
    const expected = 'https://example.com/post?a=1;b=2'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should match encoded param names', () => {
    const value = 'https://example.com/post?fb%5Fsource=feed&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep the fragment', () => {
    const value = 'https://example.com/post?fbclid=abc#section'
    const expected = 'https://example.com/post#section'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should strip on every call with a global regex', () => {
    const value = 'https://example.com/post?session_a=1'
    const params = [/^session_[a-z]$/g]
    const expected = 'https://example.com/post'

    expect(stripTrackingParams(value, params)).toBe(expected)
    expect(stripTrackingParams(value, params)).toBe(expected)
  })
})

describe('cleanUrl', () => {
  it('should unwrap and strip tracking params with defaults', () => {
    const value = 'https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpost%3Ffbclid%3Dabc'
    const expected = 'https://example.com/post'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip default tracking params without unwrapping', () => {
    const value = 'https://example.com/post?fbclid=abc&gclid=abc&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should unwrap with custom unwrappers and strip tracking params', () => {
    const target = 'https://example.com/post?fbclid=abc&id=42'
    const value = `https://redirect.example.com/?target=${encodeURIComponent(target)}`
    const options = { unwrappers: [exampleUnwrapper] }
    const expected = 'https://example.com/post?id=42'

    expect(cleanUrl(value, options)).toBe(expected)
  })

  it('should unwrap nested wrappers up to the depth limit', () => {
    const target = 'https://example.com/post'
    const inner = `https://redirect.example.com/?target=${encodeURIComponent(target)}`
    const value = `https://outer.example.com/?url=${encodeURIComponent(inner)}`
    const options = { unwrappers: [exampleUnwrapper, nestedUnwrapper] }

    expect(cleanUrl(value, options)).toBe(target)
  })

  it('should unwrap a chain twelve wrappers deep by default', () => {
    const target = 'https://traffic.example.com/episode.mp3'
    let value = target

    for (let hop = 0; hop < 12; hop++) {
      value =
        hop % 2 === 0
          ? `https://redirect.example.com/?target=${encodeURIComponent(value)}`
          : `https://outer.example.com/?url=${encodeURIComponent(value)}`
    }

    const options = { unwrappers: [exampleUnwrapper, nestedUnwrapper] }

    expect(cleanUrl(value, options)).toBe(target)
  })

  // Tumblr nests the two: the signed t.umblr.com redirect wraps an href.li referrer
  // stripper, so a single pass would still leave a redirector.
  it('should unwrap a t.umblr.com redirect wrapping an href.li one', () => {
    const target = 'https://example.com/post'
    const inner = `https://href.li/?${target}`
    const value = `https://t.umblr.com/redirect?z=${encodeURIComponent(inner)}&t=signature`

    expect(cleanUrl(value)).toBe(target)
  })

  // Zhihu wraps every outbound link in a post body, not just cards, so the redirector
  // reaches feeds on ordinary anchors.
  it('should unwrap a link.zhihu.com redirect', () => {
    const target = 'https://finagle.github.io/'
    const value = `https://link.zhihu.com/?target=${encodeURIComponent(target)}`

    expect(cleanUrl(value)).toBe(target)
  })

  it('should unwrap an anonym.to redirect', () => {
    const target = 'https://example.com/post'
    const value = `https://anonym.to/?${target}`

    expect(cleanUrl(value)).toBe(target)
  })

  it('should unwrap a deviantart outgoing redirect', () => {
    const target = 'https://example.com/post'
    const value = `https://www.deviantart.com/someuser/outgoing?${target}`

    expect(cleanUrl(value)).toBe(target)
  })

  it('should return an anonym.to URL without a target unchanged', () => {
    const value = 'https://anonym.to/'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should return a deviantart outgoing URL without a target unchanged', () => {
    const value = 'https://www.deviantart.com/someuser/outgoing'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep the target fragment through an anonym.to redirect', () => {
    const target = 'https://example.com/post#section'
    const value = `https://anonym.to/?${target}`

    expect(cleanUrl(value)).toBe(target)
  })

  it('should keep the target fragment through a deviantart outgoing redirect', () => {
    const target = 'https://example.com/post#section'
    const value = `https://www.deviantart.com/someuser/outgoing?${target}`

    expect(cleanUrl(value)).toBe(target)
  })

  it('should not unwrap an outgoing path on a host that only ends with deviantart.com', () => {
    const value = 'https://evildeviantart.com/someuser/outgoing?https://example.com/post'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should unwrap a Naver cc.loginfra redirect', () => {
    const target = 'https://example.com/post'
    const value = `https://cc.loginfra.com/cc?a=post.click&u=${encodeURIComponent(target)}`

    expect(cleanUrl(value)).toBe(target)
  })

  it('should unwrap a link.csdn.net redirect', () => {
    const target = 'https://example.com/post'
    const value = `https://link.csdn.net/?target=${encodeURIComponent(target)}`

    expect(cleanUrl(value)).toBe(target)
  })

  it('should stop unwrapping at maxUnwrapDepth', () => {
    const target = 'https://example.com/post'
    const inner = `https://redirect.example.com/?target=${encodeURIComponent(target)}`
    const value = `https://outer.example.com/?url=${encodeURIComponent(inner)}`
    const options = {
      unwrappers: [exampleUnwrapper, nestedUnwrapper],
      maxUnwrapDepth: 1,
    }

    expect(cleanUrl(value, options)).toBe(inner)
  })

  it('should not unwrap when maxUnwrapDepth is zero', () => {
    const target = 'https://example.com/post'
    const value = `https://redirect.example.com/?target=${encodeURIComponent(target)}&fbclid=abc`
    const options = {
      unwrappers: [exampleUnwrapper],
      maxUnwrapDepth: 0,
    }
    const expected = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fpost'

    expect(cleanUrl(value, options)).toBe(expected)
  })

  it('should return the unwrapped target as-is when nothing is stripped', () => {
    const target = 'https://example.com/post'
    const value = `https://redirect.example.com/?target=${encodeURIComponent(target)}`
    const options = { unwrappers: [exampleUnwrapper] }

    expect(cleanUrl(value, options)).toBe(target)
  })

  it('should respect a custom tracking param list', () => {
    const value = 'https://example.com/post?session=abc&utm_source=feed'
    const options = { trackingParams: ['session'] }
    const expected = 'https://example.com/post?utm_source=feed'

    expect(cleanUrl(value, options)).toBe(expected)
  })

  it('should keep the wrapper when the unwrapped target is not a valid URL', () => {
    const value = 'https://redirect.example.com/?target=not-a-url'
    const options = { unwrappers: [exampleUnwrapper] }

    expect(cleanUrl(value, options)).toBe(value)
  })

  it('should return a serialized URL unchanged when nothing applies', () => {
    const value = 'https://example.com/post?id=42'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should return the input unchanged when it is not a valid URL', () => {
    expect(cleanUrl('not a url')).toBe('not a url')
  })

  it('should lowercase the host', () => {
    const value = 'https://EXAMPLE.com/post'
    const expected = 'https://example.com/post'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should drop the default port', () => {
    const value = 'https://example.com:443/post'
    const expected = 'https://example.com/post'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should resolve dot segments in the path', () => {
    const value = 'https://example.com/archive/../post'
    const expected = 'https://example.com/post'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should return an IDN host in Punycode', () => {
    const value = 'https://bücher.example/post'
    const expected = 'https://xn--bcher-kva.example/post'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should serialize the unwrapped target when nothing is stripped', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%3A443%2Fpost'
    const options = { unwrappers: [exampleUnwrapper] }
    const expected = 'https://example.com/post'

    expect(cleanUrl(value, options)).toBe(expected)
  })

  it('should keep the query encoding as written when nothing is stripped', () => {
    const value = 'https://example.com/get?file=my%20doc.pdf&q=a+b'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep a valueless param as written when nothing is stripped', () => {
    const value = 'https://example.com/post?flag'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep semicolon-separated values as written when nothing is stripped', () => {
    const value = 'https://example.com/post?a=1;b=2'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should return the wrapper unchanged when its target is javascript:', () => {
    const value = 'https://anonym.to/?javascript:alert(1)'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should handle empty strings', () => {
    expect(cleanUrl('')).toBe('')
  })
})

describe('cleanUrl with a legacy-charset target', () => {
  const legacyUnwrapper = createParamExtractor({
    hosts: 'redirect.example.com',
    params: ['target'],
  })

  it('should keep the bytes of a base64 target and strip its tracking params', () => {
    const value = 'https://base64.example.com/?u=aHR0cHM6Ly9leGFtcGxlLmNvbS%2BkP2ZiY2xpZD1hYmM%3D'

    expect(cleanUrl(value, { unwrappers: [base64Unwrapper] })).toBe('https://example.com/%A4')
  })

  it('should keep the bytes of a base64 target reached through another wrapper', () => {
    const value =
      'https://outer.example.com/?url=https%3A%2F%2Fbase64.example.com%2F%3Fu%3DaHR0cHM6Ly9leGFtcGxlLmNvbS%252Bk'

    expect(cleanUrl(value, { unwrappers: [nestedUnwrapper, base64Unwrapper] })).toBe(
      'https://example.com/%A4',
    )
  })

  it('should keep a legacy-charset escape in a percent-encoded target as written', () => {
    const value =
      'https://redirect.example.com/?target=https://defense.example.net/v3/__https:/example.org/news/__;tail%%EDITOR'
    const expected = 'https://defense.example.net/v3/__https:/example.org/news/__;tail%%EDITOR'

    expect(cleanUrl(value, { unwrappers: [legacyUnwrapper] })).toBe(expected)
  })

  it('should keep a replacement character the target carries as written', () => {
    const value =
      'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fpage%EF%BF%BD%3Ffbclid%3Dabc'

    expect(cleanUrl(value, { unwrappers: [legacyUnwrapper] })).toBe(
      'https://example.com/page%EF%BF%BD',
    )
  })
})

describe('cleanUrl with a malformed target', () => {
  const singleSlashUnwrapper: UrlUnwrapper = (url) => {
    if (url.hostname !== 'defense.example.net') {
      return
    }

    return url.pathname.slice('/v3/__'.length).split('__;')[0]
  }

  it('should keep the wrapper when the target has no host', () => {
    const value = 'https://redirect.example.com/?target=https://'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should fall through to the next unwrapper when a target has no usable host', () => {
    const value =
      'https://redirect.example.com/?target=https://www.&fallback=https://example.com/post'
    const options = { unwrappers: [exampleUnwrapper, exampleFallbackUnwrapper] }
    const expected = 'https://example.com/post'

    expect(cleanUrl(value, options)).toBe(expected)
  })

  it('should keep the wrapper when the target is an s3 url behind an https scheme', () => {
    const value =
      'https://redirect.example.com/?target=https://s3://podcast.example.com/2026/6.8.26'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when the target host is a bare name', () => {
    const value = 'https://redirect.example.com/?target=http://examplecinema&source=gmail'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when the target host is localhost', () => {
    const value = 'https://redirect.example.com/?target=http://localhost:4000/'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when the target host is a bare www', () => {
    const value = 'https://redirect.example.com/?target=http%3A%2F%2Fwww'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when the target is cut off after www', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fwww.'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when the target host is an ellipsis', () => {
    const value = 'https://redirect.example.com/?target=https://...'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when a relative php link reads as the host', () => {
    const value =
      'https://redirect.example.com/?target=http:///lermais_materias.php?cd_materias%3D5919&source=gmail'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when a relative jspa link reads as the host', () => {
    const value =
      'https://redirect.example.com/?target=http:///external-link.jspa?url%3Dhttp%253A%252F%252Fexample.com%252F'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should unwrap a target whose host has a php label before its last', () => {
    const value = 'https://redirect.example.com/?target=https://www.php.net/manual/'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('https://www.php.net/manual/')
  })

  it('should unwrap a target on an IPv4 address', () => {
    const value = 'https://redirect.example.com/?target=http://192.0.2.1/x'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('http://192.0.2.1/x')
  })

  it('should unwrap a target on an IPv6 address', () => {
    const value = 'https://redirect.example.com/?target=http://[2001:db8::1]/x'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('http://[2001:db8::1]/x')
  })

  it('should unwrap a target on a dotted host', () => {
    const value = 'https://redirect.example.com/?target=https://news.example.com/x'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('https://news.example.com/x')
  })

  it('should repair a doubled scheme', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fhttps://example.com%2Fx'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('https://example.com/x')
  })

  it('should convert a feed scheme on the target', () => {
    const value = 'https://redirect.example.com/?target=feed%3Ahttps%3A%2F%2Fexample.com%2Ffeed'
    const expected = 'https://example.com/feed'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(expected)
  })

  it('should decode an html entity in the target', () => {
    const value =
      'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2F%3Fa%3D1%26amp%3Bb%3D2'
    const expected = 'https://example.com/?a=1&b=2'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(expected)
  })

  it('should repair a leading dot in the target host', () => {
    const value = 'https://redirect.example.com/?target=http://.example.com/x&source=gmail'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('http://example.com/x')
  })

  it('should repair a third slash after the scheme', () => {
    const value = 'https://redirect.example.com/?target=https:///example.com/x'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('https://example.com/x')
  })

  it('should keep the wrapper when the target holds a line break', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fa%0D%0Ab'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when the target holds a line separator', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fa%E2%80%A8b'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when the target holds a paragraph separator', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fa%E2%80%A9b'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should keep the wrapper when the target holds a delete character', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fa%7Fb'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should trim a trailing line feed from the target', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fx%0A'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('https://example.com/x')
  })

  it('should trim trailing whitespace from the target', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fx%20%20'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('https://example.com/x')
  })

  it('should repair a single slash after the scheme', () => {
    const value = 'https://redirect.example.com/?target=https:/example.com/x'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('https://example.com/x')
  })

  it('should repair a single slash after an http scheme', () => {
    const value = 'https://redirect.example.com/?target=http:/example.com/x'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('http://example.com/x')
  })

  it('should repair a single slash after an uppercase scheme', () => {
    const value = 'https://redirect.example.com/?target=HTTPS:/example.com/x'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe('https://example.com/x')
  })

  it('should keep the wrapper when the target host opens with a comma', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Ccexample.com%2F'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should drop a parenthesis closing the target host', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fwww.example.com)'
    const expected = 'https://www.example.com/'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(expected)
  })

  it('should collapse a doubled dot in the target host', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fwww..example.org%2Fevents'
    const expected = 'https://www.example.org/events'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(expected)
  })

  it('should keep the wrapper when the target host ends in an ellipsis', () => {
    const value = 'https://redirect.example.com/?target=http%3A%2F%2Fitem.example.co.j...'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(value)
  })

  it('should unwrap a target whose host label ends with a hyphen', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fok-.example.com%2Fpost'
    const expected = 'https://ok-.example.com/post'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper] })).toBe(expected)
  })

  it('should resolve a chain whose inner target has a single slash', () => {
    const value =
      'https://redirect.example.com/?target=https://defense.example.net/v3/__https:/example.org/news/__;tail'

    expect(cleanUrl(value, { unwrappers: [exampleUnwrapper, singleSlashUnwrapper] })).toBe(
      'https://example.org/news/',
    )
  })
})

describe('self-referential ref param', () => {
  it('should strip ref when its value is the same host', () => {
    const value = 'https://example.com/post?ref=example.com'
    const expected = 'https://example.com/post'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep ref when its value is a different host', () => {
    const value = 'https://example.com/post?ref=other.com'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should ignore www when comparing the host and the ref value', () => {
    const value = 'https://example.com/post?ref=www.example.com'
    const expected = 'https://example.com/post'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should ignore case when comparing the host and the ref value', () => {
    const value = 'https://example.com/post?ref=WWW.Example.com'
    const expected = 'https://example.com/post'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should strip a capitalized Ref when its value is the same host', () => {
    const value = 'https://example.com/post?Ref=example.com'
    const expected = 'https://example.com/post'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should strip an uppercase REF when its value is the same host', () => {
    const value = 'https://example.com/post?REF=example.com'
    const expected = 'https://example.com/post'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep a capitalized Ref when its value is a different host', () => {
    const value = 'https://example.com/post?Ref=example.org'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should strip a Unicode ref naming the same internationalized host', () => {
    const value = 'https://bücher.example/post?ref=bücher.example'
    const expected = 'https://xn--bcher-kva.example/post'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should strip an uppercase Unicode ref naming the same internationalized host', () => {
    const value = 'https://bücher.example/post?ref=BÜCHER.example'
    const expected = 'https://xn--bcher-kva.example/post'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep a Unicode ref naming another internationalized host', () => {
    const value = 'https://bücher.example/post?ref=bücherei.example'
    const expected = 'https://xn--bcher-kva.example/post?ref=b%C3%BCcherei.example'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep a ref holding the same host followed by a path', () => {
    const value = 'https://example.com/post?ref=example.com/about'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep an empty ref', () => {
    const value = 'https://example.com/post?ref='

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep a ref holding the same host followed by whitespace', () => {
    const value = 'https://example.com/post?ref=example.com%20'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep a ref holding the same host followed by a query', () => {
    const value = 'https://example.com/post?ref=example.com%3Fx'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep a ref holding the same host followed by a fragment', () => {
    const value = 'https://example.com/post?ref=example.com%23x'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep a ref holding the same host followed by a backslash', () => {
    const value = 'https://example.com/post?ref=example.com%5Cx'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep a ref holding the same host with a port', () => {
    const value = 'https://example.com/post?ref=example.com:8080'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep a ref holding credentials before the same host', () => {
    const value = 'https://example.com/post?ref=user@example.com'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep a ref to another host next to a self-referential one', () => {
    const value = 'https://example.com/post?ref=example.com&ref=partner.com'
    const expected = 'https://example.com/post?ref=partner.com'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep a self-referential ref with a custom list lacking housekeeping', () => {
    const value = 'https://example.com/post?ref=example.com&keep=1'
    const options = { trackingParams: ['utm_source'] }

    expect(cleanUrl(value, options)).toBe(value)
  })

  it('should strip a self-referential ref with a custom list spreading housekeeping', () => {
    const value = 'https://example.com/post?ref=example.com&keep=1'
    const options = { trackingParams: [...housekeepingParams, 'utm_source'] }
    const expected = 'https://example.com/post?keep=1'

    expect(cleanUrl(value, options)).toBe(expected)
  })

  it('should strip a self-referential ref after unwrapping', () => {
    const target = 'https://example.com/post?ref=example.com'
    const value = `https://redirect.example.com/?target=${encodeURIComponent(target)}`
    const options = { unwrappers: [exampleUnwrapper] }
    const expected = 'https://example.com/post'

    expect(cleanUrl(value, options)).toBe(expected)
  })
})

describe('signed query', () => {
  it('should keep the query of a signed file url whole', () => {
    const value =
      'https://cdn.example.com/api/utils/file/11602721.mp4?id=4A665C2C-D81B-4313-999C-3D24CB22911E&ts=1822903430&sig=NtAM31UkcdrglORmOSBE8bin4bg%3d'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep the query whole when it carries sig', () => {
    const value = 'https://cdn.example.com/file.mp4?ts=1822903430&sig=NtAM31UkcdrglORmOSBE8bin4bg'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep the query whole when it carries signature', () => {
    const value =
      'https://example.com/api/link?url=https%3A%2F%2Fexample.org%2F&timestamp=1652349406353&signature=867d5a792ea21a4f'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep the query whole when it carries X-Amz-Signature', () => {
    const value =
      'https://bucket.example.com/report.pdf?X-Amz-Expires=86400&utm_source=feed&X-Amz-Signature=3f1c2b9a'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep the query whole when it carries X-Goog-Signature', () => {
    const value =
      'https://storage.example.com/report.pdf?X-Goog-Expires=900&_=1736305435&X-Goog-Signature=9a8b7c6d'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should strip ts from a url without a signature', () => {
    const value = 'https://cdn.example.com/file.mp4?id=4A665C2C&ts=1822903430'
    const expected = 'https://cdn.example.com/file.mp4?id=4A665C2C'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should strip a query whose param name only ends in sig', () => {
    const value =
      'https://example.com/news/article.html?guccounter=1&guce_referrer=aHR0cHM6Ly93d3cuYmluZy5jb20v&guce_referrer_sig=AQAAAJjHlYZ2iDWX'
    const expected = 'https://example.com/news/article.html'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should strip a query whose nested url carries sig', () => {
    const value =
      'https://example.com/share?url=https%3A%2F%2Fcdn.example.org%2Ffile.mp4%3Fsig%3Dabc&fbclid=abc'
    const expected =
      'https://example.com/share?url=https%3A%2F%2Fcdn.example.org%2Ffile.mp4%3Fsig%3Dabc'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep a self-referential ref on a signed url', () => {
    const value = 'https://example.com/post?ref=example.com&sig=NtAM31UkcdrglORmOSBE8bin4bg'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep the query of a signed target whole after unwrapping', () => {
    const target =
      'https://cdn.example.com/file.mp4?id=4A665C2C&ts=1822903430&sig=NtAM31UkcdrglORmOSBE8bin4bg'
    const value = `https://redirect.example.com/?target=${encodeURIComponent(target)}`
    const options = { unwrappers: [exampleUnwrapper] }

    expect(cleanUrl(value, options)).toBe(target)
  })
})

describe('Alibaba DirectMail click url', () => {
  it('should keep ts on a click url', () => {
    const value =
      'https://dm-cn.aliyuncs.com/trace/v1/report?bid=2546032&env=600000333590607418&extra=1-&mac=449735&mf=info%40e.example.com&msgid=c29c9133-14cf-4876-9610-962b2835b3e8%40alibaba.com&sac=0&tag=LED&tid=2546032&to=reader%40example.org&tpl=&ts=1783913769&type=0&url=http%3A%2F%2Fwww.example.com%2F&v=1.0&sign=fed82fcd6b69c59fe6c6d8c46b34cfb4&urlts=1783913802'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should strip other tracking params from a click url', () => {
    const value =
      'https://dm-cn.aliyuncs.com/trace/v1/report?ts=1783913769&url=http%3A%2F%2Fwww.example.com%2F&fbclid=abc&sign=fed82fcd6b69c59fe6c6d8c46b34cfb4'
    const expected =
      'https://dm-cn.aliyuncs.com/trace/v1/report?ts=1783913769&url=http%3A%2F%2Fwww.example.com%2F&sign=fed82fcd6b69c59fe6c6d8c46b34cfb4'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip a param whose name only contains ts from a click url', () => {
    const value =
      'https://dm-cn.aliyuncs.com/trace/v1/report?ts=1783913769&url=http%3A%2F%2Fwww.example.com%2F&hsa_ts=1783913769'
    const expected =
      'https://dm-cn.aliyuncs.com/trace/v1/report?ts=1783913769&url=http%3A%2F%2Fwww.example.com%2F'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip ts on a subdomain of the click host', () => {
    const value =
      'https://cdn.dm-cn.aliyuncs.com/trace/v1/report?ts=1783913769&url=http%3A%2F%2Fwww.example.com%2F'
    const expected =
      'https://cdn.dm-cn.aliyuncs.com/trace/v1/report?url=http%3A%2F%2Fwww.example.com%2F'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip ts on another path of the click host', () => {
    const value =
      'https://dm-cn.aliyuncs.com/trace/v1/reports?ts=1783913769&url=http%3A%2F%2Fwww.example.com%2F'
    const expected =
      'https://dm-cn.aliyuncs.com/trace/v1/reports?url=http%3A%2F%2Fwww.example.com%2F'

    expect(cleanUrl(value)).toBe(expected)
  })
})

// Keeps a value only when it names the url's own host, to see which host an entry receives.
const isOwnHost: TrackingValueTest = (value, host) => {
  return value === host
}

describe('tracking entry', () => {
  it('should strip an entry with a name alone on every host', () => {
    const value = 'https://example.com/post?utm_source=feed&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: 'utm_source' }]
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should strip an entry with a name pattern alone on every host', () => {
    const value = 'https://example.com/post?session_a=1&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: sessionParamRegex }]
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should strip a param whose value matches the value pattern', () => {
    const value = 'https://example.com/post?sid=0123456789abcdef0123456789abcdef&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: 'sid', value: longHexRegex }]
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should keep a param whose value fails the value pattern', () => {
    const value = 'https://example.com/rss?sid=46551'
    const trackingParams: Array<TrackingParam> = [{ name: 'sid', value: longHexRegex }]

    expect(stripTrackingParams(value, trackingParams)).toBe(value)
  })

  it('should test the decoded value', () => {
    const value = 'https://example.com/post?from=example%2Ecom'
    const trackingParams: Array<TrackingParam> = [{ name: 'from', value: isOwnHost }]
    const expected = 'https://example.com/post'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should pass the host without www to a value test', () => {
    const value = 'https://www.example.com/post?from=example.com'
    const trackingParams: Array<TrackingParam> = [{ name: 'from', value: isOwnHost }]
    const expected = 'https://www.example.com/post'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should test an empty value for a param with no equals sign', () => {
    const value = 'https://example.com/post?sid&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: 'sid', value: longHexRegex }]

    expect(stripTrackingParams(value, trackingParams)).toBe(value)
  })

  it('should strip a param on a listed host', () => {
    const value = 'https://shop.example/item?from=list&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: 'from', hosts: 'shop.example' }]
    const expected = 'https://shop.example/item?id=42'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should keep a param on a host not listed', () => {
    const value = 'https://example.com/item?from=list&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: 'from', hosts: 'shop.example' }]

    expect(stripTrackingParams(value, trackingParams)).toBe(value)
  })

  it('should strip a param on the www form of a listed host', () => {
    const value = 'https://www.shop.example/item?from=list&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: 'from', hosts: 'shop.example' }]
    const expected = 'https://www.shop.example/item?id=42'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should strip a param on any host of a host list', () => {
    const value = 'https://store.example/item?from=list&id=42'
    const trackingParams: Array<TrackingParam> = [
      { name: 'from', hosts: ['shop.example', 'store.example'] },
    ]
    const expected = 'https://store.example/item?id=42'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should strip a param on a host matching the host pattern', () => {
    const value = 'https://m.shop.example/item?from=list&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: 'from', hosts: shopHostRegex }]
    const expected = 'https://m.shop.example/item?id=42'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should keep a param on a host failing the host pattern', () => {
    const value = 'https://myshop.example/item?from=list&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: 'from', hosts: shopHostRegex }]

    expect(stripTrackingParams(value, trackingParams)).toBe(value)
  })

  it('should keep a param matching the value pattern on a host not listed', () => {
    const value = 'https://example.com/post?sid=0123456789abcdef0123456789abcdef'
    const trackingParams: Array<TrackingParam> = [
      { name: 'sid', value: longHexRegex, hosts: 'shop.example' },
    ]

    expect(stripTrackingParams(value, trackingParams)).toBe(value)
  })

  it('should drop the whole query on a host with a pattern matching every name', () => {
    const value = 'https://shop.example/item?from=list&id=42'
    const trackingParams: Array<TrackingParam> = [{ name: everyNameRegex, hosts: 'shop.example' }]
    const expected = 'https://shop.example/item'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should keep only the names a negative lookahead excludes', () => {
    const value = 'https://shop.example/item?from=list&id=42&user=7'
    const trackingParams: Array<TrackingParam> = [{ name: exceptIdRegex, hosts: 'shop.example' }]
    const expected = 'https://shop.example/item?id=42'

    expect(stripTrackingParams(value, trackingParams)).toBe(expected)
  })

  it('should keep a signed query whole on a host whose entry drops every name', () => {
    const value = 'https://shop.example/item?from=list&id=42&signature=abc'
    const trackingParams: Array<TrackingParam> = [{ name: everyNameRegex, hosts: 'shop.example' }]

    expect(stripTrackingParams(value, trackingParams)).toBe(value)
  })
})

describe('isTrackingParam', () => {
  it('should answer true for a default param', () => {
    expect(isTrackingParam('fbclid', 'abc', 'example.com')).toBe(true)
  })

  it('should answer false for a param no list holds', () => {
    expect(isTrackingParam('id', '42', 'example.com')).toBe(false)
  })

  it('should match the name in any case', () => {
    expect(isTrackingParam('FBCLID', 'abc', 'example.com')).toBe(true)
  })

  it('should leave out the opt-in categories by default', () => {
    expect(isTrackingParam('utm_source', 'feed', 'example.com')).toBe(false)
  })

  it('should use the list it is given', () => {
    expect(isTrackingParam('utm_source', 'feed', 'example.com', campaignParams)).toBe(true)
  })

  it('should test the value of an entry', () => {
    const trackingParams: Array<TrackingParam> = [{ name: 'sid', value: longHexRegex }]

    expect(isTrackingParam('sid', '46551', 'example.com', trackingParams)).toBe(false)
  })

  it('should test an undefined value as empty', () => {
    const trackingParams: Array<TrackingParam> = [{ name: 'flag', value: emptyRegex }]

    expect(isTrackingParam('flag', undefined, 'example.com', trackingParams)).toBe(true)
  })

  it('should match a listed host given with www', () => {
    const trackingParams: Array<TrackingParam> = [{ name: 'from', hosts: 'shop.example' }]

    expect(isTrackingParam('from', 'list', 'www.shop.example', trackingParams)).toBe(true)
  })

  it('should match a listed host given in uppercase', () => {
    const trackingParams: Array<TrackingParam> = [{ name: 'from', hosts: 'shop.example' }]

    expect(isTrackingParam('from', 'list', 'SHOP.example', trackingParams)).toBe(true)
  })

  it('should answer through a query param predicate taking the url', () => {
    const trackingParams: Array<TrackingParam> = [{ name: 'from', hosts: 'shop.example' }]
    const isQueryParamTracking = (name: string, value: string | undefined, url: URL): boolean => {
      return isTrackingParam(name, value, url.hostname, trackingParams)
    }
    const value = new URL('https://www.shop.example/item?from=list')

    expect(isQueryParamTracking('from', 'list', value)).toBe(true)
  })
})

describe('session ids', () => {
  it('should strip PHPSESSID', () => {
    const value =
      'https://forum.example.com/index.php?PHPSESSID=3f01a9a50ab99bff744317fc3cb0b92b&topic=2590.40'
    const expected = 'https://forum.example.com/index.php?topic=2590.40'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip JSESSIONID from the query', () => {
    const value =
      'https://example.com/rss/news.shtml?jsessionid=02B4978C7CE0C25C878D034E5DF9C9DD&id=7'
    const expected = 'https://example.com/rss/news.shtml?id=7'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip a classic ASP session id', () => {
    const value = 'https://example.com/page.asp?ASPSESSIONIDQASTCRBA=MEJFLHPDNDGKOEOAJCMBNEKP&id=7'
    const expected = 'https://example.com/page.asp?id=7'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip CFID and CFTOKEN', () => {
    const value = 'https://example.com/doc.pdf?key1=1281671&CFID=11714&CFTOKEN=34558592'
    const expected = 'https://example.com/doc.pdf?key1=1281671'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip a session-shaped sid', () => {
    const value = 'https://example.com/search?sid=46a3f0c2e8b1d4f6a9c3e5b7d1f2a4c6&city=7'
    const expected = 'https://example.com/search?city=7'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip a session-shaped sid followed by a second question mark', () => {
    const value = 'https://example.com/search?sid=46a3f0c2e8b1d4f6a9c3e5b7d1f2a4c6?city=7'
    const expected = 'https://example.com/search'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep a short sid', () => {
    const value = 'https://example.com/rss?sid=46551'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep a CJ SubID without a digit', () => {
    const value =
      'https://www.example.com/click-3471301-13819538?sid=SeafoodChorizePaellaRecipeStaubDoubleHandleFryPan&url=https%3A%2F%2Fshop.example.com%2Fpan'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should strip a 26-character PHP session id as sid', () => {
    const value = 'https://example.com/index.php?sid=qd860jvhk9vphrslp7a9932kgd&topic=7'
    const expected = 'https://example.com/index.php?topic=7'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep a sid of 25 characters', () => {
    const value = 'https://example.com/rss?sid=46a3f0c2e8b1d4f6a9c3e5b7d'

    expect(cleanUrl(value)).toBe(value)
  })
})

describe('path params', () => {
  it('should strip a jsessionid path param', () => {
    const value = 'https://example.com/site/Donation2;jsessionid=00000000.app20023b?idb=682725718'
    const expected = 'https://example.com/site/Donation2?idb=682725718'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip an uppercase JSESSIONID path param', () => {
    const value = 'https://example.com/servlets/ProductServlet;JSESSIONID=07BCD08E5B349EC6'
    const expected = 'https://example.com/servlets/ProductServlet'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep a path param no list holds', () => {
    const value = 'https://example.com/map;lat=52.1;lon=21.0'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should strip only the listed path param among others', () => {
    const value = 'https://example.com/page;jsessionid=ABC123;lang=en'
    const expected = 'https://example.com/page;lang=en'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip a path param inside the path', () => {
    const value = 'https://example.com/shop;jsessionid=ABC123/item/42'
    const expected = 'https://example.com/shop/item/42'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep a path param whose name only an entry holds', () => {
    const value = 'https://example.com/page;sid=46a3f0c2e8b1d4f6a9c3e5b7d1f2a4c6'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep a path param with a custom list lacking it', () => {
    const value = 'https://example.com/page;jsessionid=ABC123'

    expect(stripTrackingParams(value, ['utm_source'])).toBe(value)
  })

  it('should keep the path of a signed url whole', () => {
    const value = 'https://cdn.example.com/file;jsessionid=ABC123?Signature=abc'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should scan a long run of path params in linear time', () => {
    const value = `https://example.com/${';a'.repeat(100_000)}`
    const start = performance.now()

    cleanUrl(value)

    expect(performance.now() - start).toBeLessThan(1000)
  })
})

describe('host-scoped click attribution', () => {
  it('should drop the query of a Douyin share link', () => {
    const value =
      'https://www.iesdouyin.com/share/video/7129381734923177246/?region=CN&mid=7129381800000000000&u_code=abc&did=1'
    const expected = 'https://www.iesdouyin.com/share/video/7129381734923177246/'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should drop the query of a Douyin video page', () => {
    const value = 'https://www.douyin.com/video/7129381734923177246?previous_page=app_code_link'
    const expected = 'https://www.douyin.com/video/7129381734923177246'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep modal_id on a Douyin page', () => {
    const value =
      'https://www.douyin.com/discover?modal_id=7129381734923177246&previous_page=app_code_link'
    const expected = 'https://www.douyin.com/discover?modal_id=7129381734923177246'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep vid on a Douyin user page', () => {
    const value =
      'https://www.douyin.com/user/MS4wLjABAAAAmYWDaUwRro4ONVYTyTUfq6Ur8imDsE47pVwyqw5Lqzk?relation=0&vid=7129381734923177246'
    const expected =
      'https://www.douyin.com/user/MS4wLjABAAAAmYWDaUwRro4ONVYTyTUfq6Ur8imDsE47pVwyqw5Lqzk?vid=7129381734923177246'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should drop a name that only starts with vid on Douyin', () => {
    const value = 'https://www.douyin.com/video/7129381734923177246?vidx=1'
    const expected = 'https://www.douyin.com/video/7129381734923177246'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep the query on a host ending in douyin.com', () => {
    const value = 'https://www.notdouyin.com/video/7129381734923177246?previous_page=app_code_link'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should drop the query of an SMZDM post', () => {
    const value = 'https://post.smzdm.com/p/ar6kpg7g/?send_by=3716913905&from=other'
    const expected = 'https://post.smzdm.com/p/ar6kpg7g/'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should drop the query of an SMZDM page on www.smzdm.com', () => {
    const value = 'https://www.smzdm.com/p/12345678/?send_by=3716913905&from=other'
    const expected = 'https://www.smzdm.com/p/12345678/'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep the query of an SMZDM search', () => {
    const value =
      'http://search.smzdm.com/?c=home&order=time&s=%E4%BA%AC%E4%B8%9C%E5%9B%BE%E4%B9%A6&v=b'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep only the product params on a JD product page', () => {
    const value = 'https://item.jd.com/100004898715.html?cu=true&skuIds=100004898715&pps=jdq.share'
    const expected = 'https://item.jd.com/100004898715.html?skuIds=100004898715'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep only the product params on a JD mobile product page', () => {
    const value = 'https://item.m.jd.com/product/100004898715.html?gx=abc&ad_od=share&wareId=7'
    const expected = 'https://item.m.jd.com/product/100004898715.html?wareId=7'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep every JD product param', () => {
    const value =
      'https://item.jd.com/100004898715.html?id=1&shopId=2&skuIds=3&suitId=4&wareId=5&cu=true'
    const expected =
      'https://item.jd.com/100004898715.html?id=1&shopId=2&skuIds=3&suitId=4&wareId=5'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should drop a name that only starts with a JD product param', () => {
    const value = 'https://item.jd.com/100004898715.html?idx=1&skuIds=3'
    const expected = 'https://item.jd.com/100004898715.html?skuIds=3'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep the query of a JD affiliate click link', () => {
    const value = 'https://union-click.jd.com/jdc?e=abc&p=JF8BAN8JK1olXwUFU1pfC0sQ'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should drop the query of a Kuaishou share link', () => {
    const value =
      'https://www.kuaishou.com/short-video/3xg6fmtj9qjhm2q?fid=0&cc=share_copylink&shareMethod=TOKEN&kpn=KUAISHOU'
    const expected = 'https://www.kuaishou.com/short-video/3xg6fmtj9qjhm2q'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should drop the query of a Kuaishou link on m.gifshow.com', () => {
    const value = 'https://m.gifshow.com/fw/photo/5230364029584519186?cc=share_copylink&fid=0'
    const expected = 'https://m.gifshow.com/fw/photo/5230364029584519186'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should drop the query of a Kuaishou link on a subdomain of m.chenzhongtech.com', () => {
    const value =
      'https://v.m.chenzhongtech.com/fw/photo/5230364029584519186?cc=share_copylink&fid=0'
    const expected = 'https://v.m.chenzhongtech.com/fw/photo/5230364029584519186'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep the query on a host ending in m.gifshow.com', () => {
    const value = 'https://wm.gifshow.com/fw/photo/5230364029584519186?cc=share_copylink&fid=0'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep the query on a host ending in kuaishou.com', () => {
    const value = 'https://www.notkuaishou.com/short-video/3xg6fmtj9qjhm2q?fid=0&cc=share_copylink'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep the query on a host starting with kuaishou.com', () => {
    const value = 'https://kuaishou.com.example/short-video/3xg6fmtj9qjhm2q?fid=0&cc=share_copylink'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep only xsec_token on a Xiaohongshu note', () => {
    const value =
      'https://www.xiaohongshu.com/discovery/item/68ac166a000000001d012571?source=webshare&xhsshare=pc_web&xsec_token=CBxtz16cD7hBeyge2T9Q3r5OWhHWYeqpxRhRb2uIoNKxk=&xsec_source=pc_share'
    const expected =
      'https://www.xiaohongshu.com/discovery/item/68ac166a000000001d012571?xsec_token=CBxtz16cD7hBeyge2T9Q3r5OWhHWYeqpxRhRb2uIoNKxk='

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep the query on a host starting with xiaohongshu.com', () => {
    const value =
      'https://xiaohongshu.com.example.com/discovery/item/68ac166a000000001d012571?source=webshare&xhsshare=pc_web'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should drop a name that only starts with xsec_token on Xiaohongshu', () => {
    const value =
      'https://www.xiaohongshu.com/discovery/item/68ac166a000000001d012571?xsec_token=CBxtz16cD7hBeyge2T9Q3r5OWhHWYeqpxRhRb2uIoNKxk=&xsec_tokens=1'
    const expected =
      'https://www.xiaohongshu.com/discovery/item/68ac166a000000001d012571?xsec_token=CBxtz16cD7hBeyge2T9Q3r5OWhHWYeqpxRhRb2uIoNKxk='

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep the query on a host ending in xiaohongshu.com', () => {
    const value =
      'https://www.notxiaohongshu.com/discovery/item/68ac166a000000001d012571?source=webshare&xhsshare=pc_web'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should keep only the id on a NetEase Cloud Music playlist', () => {
    const value = 'https://y.music.163.com/m/playlist?id=2809513713&userid=1&creatorId=2'
    const expected = 'https://y.music.163.com/m/playlist?id=2809513713'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should drop a name that only starts with id on NetEase Cloud Music', () => {
    const value = 'https://y.music.163.com/m/playlist?id=2809513713&ids=1'
    const expected = 'https://y.music.163.com/m/playlist?id=2809513713'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should keep the query on another NetEase host', () => {
    const value = 'https://music.163.com/playlist?id=2809513713&creatorId=2'

    expect(cleanUrl(value)).toBe(value)
  })
})
