import { describe, expect, it } from 'bun:test'
import { unwrapWordpressOembed } from './wordpressOembed.js'

describe('unwrapWordpressOembed', () => {
  it('should extract the page from the wp-json route', () => {
    const value = new URL(
      'https://example.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fexample.com%2Fanalyst-bitcoin-indicator%2F',
    )
    const expected = 'https://example.com/analyst-bitcoin-indicator/'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should extract the page from the wp-json route with the xml format', () => {
    const value = new URL(
      'https://example.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fexample.com%2Fexample-post%2F&format=xml',
    )
    const expected = 'https://example.com/example-post/'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should extract the page with the xml format before the url', () => {
    const value = new URL(
      'http://www.example.com/wordpress/wp-json/oembed/1.0/embed?format=xml&url=https://example.org/',
    )
    const expected = 'https://example.org/'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should extract the page below a subfolder install', () => {
    const value = new URL(
      'https://www.example.com/blog/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.example.com%2Fblog%2Fpost%2F&format=xml',
    )
    const expected = 'https://www.example.com/blog/post/'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should extract the page below a two-segment prefix', () => {
    const value = new URL(
      'http://www.example.com/example.com/wordpress/wp-json/oembed/1.0/embed?format=xml&url=https://example.org/',
    )
    const expected = 'https://example.org/'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should extract the page from the rest_route param on the root', () => {
    const value = new URL(
      'http://www.example.com/?format=xml&rest_route=/oembed/1.0/embed&url=https://example.org/',
    )
    const expected = 'https://example.org/'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should extract the page from an encoded rest_route param on index.php', () => {
    const value = new URL(
      'https://example.com/index.php?rest_route=%2Foembed%2F1.0%2Fembed&url=https%3A%2F%2Fexample.com%2F%3Fp%3D90372&format=xml',
    )
    const expected = 'https://example.com/?p=90372'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should extract the page from the rest_route param below a subfolder install', () => {
    const value = new URL(
      'http://example.com/wp/?rest_route=/oembed/1.0/embed&url=https://example.org/',
    )
    const expected = 'https://example.org/'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should extract the page from a mixed-case path', () => {
    const value = new URL(
      'https://example.com/WP-JSON/oEmbed/1.0/Embed?url=https%3A%2F%2Fexample.com%2Fexample-post%2F',
    )
    const expected = 'https://example.com/example-post/'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should read the last url param', () => {
    const value = new URL(
      'https://example.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fexample.com%2Fa%2F&url=https%3A%2F%2Fexample.com%2Fb%2F',
    )
    const expected = 'https://example.com/b/'

    expect(unwrapWordpressOembed(value)).toBe(expected)
  })

  it('should return undefined for a sibling wp-json route', () => {
    const value = new URL(
      'https://example.com/wp-json/oembed/1.0/proxy?url=https%3A%2F%2Fexample.com%2Fexample-post%2F',
    )

    expect(unwrapWordpressOembed(value)).toBeUndefined()
  })

  it('should return undefined for a path below the route', () => {
    const value = new URL(
      'https://example.com/wp-json/oembed/1.0/embed/preview?url=https%3A%2F%2Fexample.com%2Fexample-post%2F',
    )

    expect(unwrapWordpressOembed(value)).toBeUndefined()
  })

  it('should return undefined for a sibling rest_route', () => {
    const value = new URL(
      'https://example.com/?rest_route=/oembed/1.0/proxy&url=https%3A%2F%2Fexample.com%2Fexample-post%2F',
    )

    expect(unwrapWordpressOembed(value)).toBeUndefined()
  })

  it('should return undefined for the rest_route param on another page', () => {
    const value = new URL(
      'https://example.com/search.php?rest_route=/oembed/1.0/embed&url=https%3A%2F%2Fexample.com%2Fexample-post%2F',
    )

    expect(unwrapWordpressOembed(value)).toBeUndefined()
  })

  it('should return undefined for a url value that is not an http url', () => {
    const value = new URL('https://example.com/wp-json/oembed/1.0/embed?url=%2F%3Fp%3D90372')

    expect(unwrapWordpressOembed(value)).toBeUndefined()
  })

  it('should return undefined for an empty url param', () => {
    const value = new URL('https://example.com/wp-json/oembed/1.0/embed?url=&format=xml')

    expect(unwrapWordpressOembed(value)).toBeUndefined()
  })

  it('should return undefined without a url param', () => {
    const value = new URL('https://example.com/?rest_route=/oembed/1.0/embed&format=xml')

    expect(unwrapWordpressOembed(value)).toBeUndefined()
  })
})
