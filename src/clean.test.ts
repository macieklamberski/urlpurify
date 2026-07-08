import { describe, expect, it } from 'bun:test'
import { cleanUrl, stripTrackingParams, unwrapUrl } from './clean.js'
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

  it('should not match anchored patterns inside longer names', () => {
    const value = 'https://example.com/post?xutm_sourcey=1'

    expect(stripTrackingParams(value)).toBe(value)
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

  it('should handle empty strings', () => {
    expect(cleanUrl('')).toBe('')
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
