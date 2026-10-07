import { describe, expect, it } from 'bun:test'
import { cleanUrl, stripTrackingParams, unwrapUrl } from './clean.js'
import type { UrlUnwrapper } from './types.js'
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

const definitionPathRegex = /^\/v3\/__(https?):\/(.+?)__;/
const sessionParamRegex = /^session_[a-z]$/
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

  it('should trim whitespace around the target', () => {
    const value = 'https://redirect.example.com/?target=%20https%3A%2F%2Fexample.com%2Fpost%0A'
    const expected = 'https://example.com/post'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBe(expected)
  })

  it('should return undefined for a target with a control character', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fa%0D%0Ab'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBeUndefined()
  })

  it('should return undefined for a target that decodes to U+FFFD', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2F%A4%A2'

    expect(unwrapUrl(value, [exampleUnwrapper])).toBeUndefined()
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
    const value = 'https://example.com/post?utm_source=feed&id=42'
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

  it('should return the input unchanged when nothing matches', () => {
    const value = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value, ['utm_source'])).toBe(value)
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
    const value = 'https://example.com/post?utm_id=abc123&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should match patterns against lowercased names', () => {
    const value = 'https://example.com/post?UTM_ID=abc123&id=42'
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

  it('should keep cid, which carries functional IDs', () => {
    const value = 'https://www.google.com/maps?cid=1234567890'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should not match anchored patterns inside longer names', () => {
    const value = 'https://example.com/post?xutm_sourcey=1'

    expect(stripTrackingParams(value)).toBe(value)
  })

  it('should keep a valueless param as written', () => {
    const value = 'https://example.com/post?flag&utm_source=feed'
    const expected = 'https://example.com/post?flag'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep an empty pair as written', () => {
    const value = 'https://example.com/post?a=1&&utm_source=feed'
    const expected = 'https://example.com/post?a=1&'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep the encoding of the remaining params', () => {
    const value = 'https://example.com/get?file=my%20doc.pdf&q=a+b&utm_source=feed'
    const expected = 'https://example.com/get?file=my%20doc.pdf&q=a+b'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep semicolon-separated values as written', () => {
    const value = 'https://example.com/post?a=1;b=2&utm_source=feed'
    const expected = 'https://example.com/post?a=1;b=2'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should match encoded param names', () => {
    const value = 'https://example.com/post?utm%5Fsource=feed&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should keep the fragment', () => {
    const value = 'https://example.com/post?utm_source=feed#section'
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
    const value =
      'https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpost%3Futm_source%3Dnewsletter'
    const expected = 'https://example.com/post'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip default tracking params without unwrapping', () => {
    const value = 'https://example.com/post?utm_source=feed&utm_medium=email&id=42'
    const expected = 'https://example.com/post?id=42'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should unwrap with custom unwrappers and strip tracking params', () => {
    const target = 'https://example.com/post?utm_source=feed&id=42'
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

  it('should unwrap a chain six wrappers deep by default', () => {
    const target = 'https://example.com/episode.mp3'
    const hop6 = `https://redirect.example.com/?target=${encodeURIComponent(target)}`
    const hop5 = `https://outer.example.com/?url=${encodeURIComponent(hop6)}`
    const hop4 = `https://redirect.example.com/?target=${encodeURIComponent(hop5)}`
    const hop3 = `https://outer.example.com/?url=${encodeURIComponent(hop4)}`
    const hop2 = `https://redirect.example.com/?target=${encodeURIComponent(hop3)}`
    const value = `https://outer.example.com/?url=${encodeURIComponent(hop2)}`
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
    const value = `https://redirect.example.com/?target=${encodeURIComponent(target)}&utm_source=feed`
    const options = {
      unwrappers: [exampleUnwrapper],
      maxUnwrapDepth: 0,
    }
    const expected = `https://redirect.example.com/?target=${encodeURIComponent(target)}`

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

  it('should return the input unchanged when nothing applies', () => {
    const value = 'https://example.com/post?id=42'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should return the input unchanged when it is not a valid URL', () => {
    expect(cleanUrl('not a url')).toBe('not a url')
  })

  it('should return the wrapper unchanged when its target is javascript:', () => {
    const value = 'https://anonym.to/?javascript:alert(1)'

    expect(cleanUrl(value)).toBe(value)
  })

  it('should handle empty strings', () => {
    expect(cleanUrl('')).toBe('')
  })
})

describe('cleanUrl with a mis-decoded target', () => {
  const definitionUnwrapper: UrlUnwrapper = (url) => {
    if (url.hostname !== 'defense.example.net') {
      return
    }

    const match = url.pathname.match(definitionPathRegex)

    if (match) {
      return `${match[1]}://${match[2]}`
    }
  }
  const legacyUnwrapper = createParamExtractor({
    hosts: 'redirect.example.com',
    params: ['target'],
  })

  it('should keep the wrapper when the target decodes to U+FFFD', () => {
    const value = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2F%A4%A2'

    expect(cleanUrl(value, { unwrappers: [legacyUnwrapper] })).toBe(value)
  })

  it('should leave the tracking params of the broken target alone', () => {
    const value =
      'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2F%A4%3Futm_source%3Dfeed'

    expect(cleanUrl(value, { unwrappers: [legacyUnwrapper] })).toBe(value)
  })

  it('should strip the tracking params of the wrapper it falls back to', () => {
    const value =
      'https://redirect.example.com/?utm_source=feed&target=https%3A%2F%2Fexample.com%2F%A4'
    const expected = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2F%A4'

    expect(cleanUrl(value, { unwrappers: [legacyUnwrapper] })).toBe(expected)
  })

  it('should return the final target when an inner hop holds U+FFFD', () => {
    const value =
      'https://redirect.example.com/?target=https://defense.example.net/v3/__https:/example.org/news/__;tail%%EDITOR'
    const expected = 'https://example.org/news/'

    expect(cleanUrl(value, { unwrappers: [legacyUnwrapper, definitionUnwrapper] })).toBe(expected)
  })

  it('should fall back to the last intact hop when a later hop decodes to U+FFFD', () => {
    const value =
      'https://outer.example.com/?url=https%3A%2F%2Fredirect.example.com%2F%3Ftarget%3Dhttps%253A%252F%252Fexample.com%252F%25A4'
    const expected = 'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2F%A4'

    expect(cleanUrl(value, { unwrappers: [nestedUnwrapper, legacyUnwrapper] })).toBe(expected)
  })

  it('should fall back to the last hop without U+FFFD', () => {
    const value =
      'https://redirect.example.com/?target=https://defense.example.net/v3/__https:/example.org/news/__;tail%%EDITOR'
    const expected =
      'https://redirect.example.com/?target=https://defense.example.net/v3/__https:/example.org/news/__;tail%%EDITOR'

    expect(cleanUrl(value, { unwrappers: [legacyUnwrapper] })).toBe(expected)
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

  it('should keep the wrapper when the target host has an empty label', () => {
    const value = 'https://redirect.example.com/?target=http%3A%2F%2Fexample..com%2F'

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

  it('should keep a ref to another host next to a self-referential one', () => {
    const value = 'https://example.com/post?ref=example.com&ref=partner.com'
    const expected = 'https://example.com/post?ref=partner.com'

    expect(stripTrackingParams(value)).toBe(expected)
  })

  it('should strip a self-referential ref even with a custom tracking list', () => {
    const value = 'https://example.com/post?ref=example.com&keep=1'
    const options = { trackingParams: ['utm_source'] }
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
      'https://example.com/share?url=https%3A%2F%2Fcdn.example.org%2Ffile.mp4%3Fsig%3Dabc&utm_source=feed'
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
      'https://dm-cn.aliyuncs.com/trace/v1/report?ts=1783913769&url=http%3A%2F%2Fwww.example.com%2F&utm_source=feed&sign=fed82fcd6b69c59fe6c6d8c46b34cfb4'
    const expected =
      'https://dm-cn.aliyuncs.com/trace/v1/report?ts=1783913769&url=http%3A%2F%2Fwww.example.com%2F&sign=fed82fcd6b69c59fe6c6d8c46b34cfb4'

    expect(cleanUrl(value)).toBe(expected)
  })

  it('should strip a param whose name only contains ts from a click url', () => {
    const value =
      'https://dm-cn.aliyuncs.com/trace/v1/report?ts=1783913769&url=http%3A%2F%2Fwww.example.com%2F&utm_ts=1783913769'
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
