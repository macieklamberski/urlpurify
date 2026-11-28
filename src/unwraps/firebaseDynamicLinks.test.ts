import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapFirebaseDynamicLinks } from './firebaseDynamicLinks.js'

describe('unwrapFirebaseDynamicLinks', () => {
  it('should extract target from ofl param on .page.link host', () => {
    const value = new URL('https://example.page.link/?ofl=https%3A%2F%2Fexample.com%2Ffallback')
    const expected = 'https://example.com/fallback'

    expect(unwrapFirebaseDynamicLinks(value)).toBe(expected)
  })

  it('should accept any subdomain under page.link', () => {
    const value = new URL('https://my-app.page.link/?ofl=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapFirebaseDynamicLinks(value)).toBe(expected)
  })

  it('should return undefined when ofl param is missing', () => {
    const value = new URL('https://example.page.link/?other=value')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should return undefined for non page.link hosts', () => {
    const value = new URL('https://example.com/?ofl=https%3A%2F%2Fother.com')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should prefer ofl over link when both are present', () => {
    const value = new URL(
      'https://example.page.link/?link=https%3A%2F%2Fexample.com%2Fcanonical&ofl=https%3A%2F%2Fexample.com%2Ffallback',
    )
    const expected = 'https://example.com/fallback'

    expect(unwrapFirebaseDynamicLinks(value)).toBe(expected)
  })

  it('should extract target from link param on .app.goo.gl host', () => {
    const value = new URL(
      'https://playmusic.app.goo.gl/?ibi=com.google.PlayMusic&isi=691797987&ius=googleplaymusic&apn=com.google.android.music&link=https://example.com/music/m/abc?t%3DEpisode',
    )
    const expected = 'https://example.com/music/m/abc?t=Episode'

    expect(unwrapFirebaseDynamicLinks(value)).toBe(expected)
  })

  it('should accept a multi-label host under app.goo.gl', () => {
    const value = new URL('https://www.playmusic.app.goo.gl/?link=https://example.com/page')
    const expected = 'https://example.com/page'

    expect(unwrapFirebaseDynamicLinks(value)).toBe(expected)
  })

  it('should extract target from link param on goo.gl/app/<name> path', () => {
    const value = new URL(
      'https://goo.gl/app/playmusic?ibi=com.google.PlayMusic&isi=691797987&ius=googleplaymusic&link=https://example.com/music/m/abc',
    )
    const expected = 'https://example.com/music/m/abc'

    expect(unwrapFirebaseDynamicLinks(value)).toBe(expected)
  })

  it('should return undefined for a goo.gl short link', () => {
    const value = new URL('https://goo.gl/abc123?link=https://example.com/page')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should return undefined for a deeper path under goo.gl/app', () => {
    const value = new URL('https://goo.gl/app/playmusic/extra?link=https://example.com/page')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should return undefined when app is not the first goo.gl path segment', () => {
    const value = new URL('https://goo.gl/x/app/playmusic?link=https://example.com/page')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends in goo.gl', () => {
    const value = new URL('https://notgoo.gl/?link=https://example.com/page')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends in page.link', () => {
    const value = new URL('https://examplepage.link/?link=https://example.com/page')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should return undefined for the app path on another goo.gl subdomain', () => {
    const value = new URL('https://maps.goo.gl/app/playmusic?link=https://example.com/page')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should return undefined for a path on a page.link host', () => {
    const value = new URL('https://example.page.link/abc123?link=https://example.com/page')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should return undefined for a short link on an app.goo.gl subdomain', () => {
    const value = new URL('https://maps.app.goo.gl/abc123?link=https://example.com/page')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should return undefined for a path on app.goo.gl itself', () => {
    const value = new URL('https://app.goo.gl/abc123?link=https://example.com/page')

    expect(unwrapFirebaseDynamicLinks(value)).toBeUndefined()
  })

  it('should extract target from link param on app.goo.gl itself', () => {
    const value = new URL('https://app.goo.gl/?link=https://example.com/page')
    const expected = 'https://example.com/page'

    expect(unwrapFirebaseDynamicLinks(value)).toBe(expected)
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapFirebaseDynamicLinks)).toBe(true)
  })

  it('should read the app path on the www. shortener host', () => {
    const value = new URL('https://www.goo.gl/app/playmusic?link=https://example.com/page')
    const expected = 'https://example.com/page'

    expect(unwrapFirebaseDynamicLinks(value)).toBe(expected)
  })
})
