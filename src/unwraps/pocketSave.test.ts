import { describe, expect, it } from 'bun:test'
import { unwrapPocketSave } from './pocketSave.js'

describe('unwrapPocketSave', () => {
  it('should extract an unencoded page from a save link', () => {
    const value = new URL(
      'https://getpocket.com/save?url=https://www.example.com/tags/memory/all/feed',
    )
    const expected = 'https://www.example.com/tags/memory/all/feed'

    expect(unwrapPocketSave(value)).toBe(expected)
  })

  it('should extract an encoded page with its own query from a save link', () => {
    const value = new URL(
      'https://getpocket.com/save?url=https%3A%2F%2Fexample.com%2Fplaylists-ecriture%2F%3Futm_source%3Dpocket%26utm_medium%3DSocial%26utm_campaign%3DSocialWarfare',
    )
    const expected =
      'https://example.com/playlists-ecriture/?utm_source=pocket&utm_medium=Social&utm_campaign=SocialWarfare'

    expect(unwrapPocketSave(value)).toBe(expected)
  })

  it('should extract the page after a title', () => {
    const value = new URL(
      'https://getpocket.com/save?title=New+site%3A+F1pace.com&url=https%3A%2F%2Fexample.com%2Fnew-blog-f1pace-com%2F',
    )
    const expected = 'https://example.com/new-blog-f1pace-com/'

    expect(unwrapPocketSave(value)).toBe(expected)
  })

  it('should extract the page from the edit form', () => {
    const value = new URL(
      'https://getpocket.com/edit?url=https%3A%2F%2Fexample.com%2F2022%2F01%2F22%2Fefkola-i-protoporos%2F',
    )
    const expected = 'https://example.com/2022/01/22/efkola-i-protoporos/'

    expect(unwrapPocketSave(value)).toBe(expected)
  })

  it('should extract the page from the old edit form', () => {
    const value = new URL(
      'https://getpocket.com/edit.php?url=http%3A%2F%2Fexample.com%2Farchives%2F603&url=http%3A%2F%2Fexample.com%2Farchives%2F603&title=Buraku',
    )
    const expected = 'http://example.com/archives/603'

    expect(unwrapPocketSave(value)).toBe(expected)
  })

  it('should extract the page from the save button frame', () => {
    const value = new URL(
      'https://widgets.getpocket.com/v1/button?label=pocket&count=horizontal&v=1&url=https%3A%2F%2Fexample.com%2Fe10640366.html&title=hairSwitch&src=https%3A%2F%2Fexample.com%2Fe10640366.html&r=0.6754602106485603',
    )
    const expected = 'https://example.com/e10640366.html'

    expect(unwrapPocketSave(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL('https://getpocket.com/save?url=https%253A%252F%252Fexample.com%252Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapPocketSave(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://getpocket.com/Save?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapPocketSave(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://getpocket.com/save?title=Hello')

    expect(unwrapPocketSave(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://getpocket.com/save?url=&title=Hello')

    expect(unwrapPocketSave(value)).toBeUndefined()
  })

  it('should return undefined for a page held only in the title', () => {
    const value = new URL('https://getpocket.com/save?title=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPocketSave(value)).toBeUndefined()
  })

  it('should return undefined for the redirect path', () => {
    const value = new URL('https://getpocket.com/redirect?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPocketSave(value)).toBeUndefined()
  })

  it('should return undefined for the save count api', () => {
    const value = new URL(
      'https://widgets.getpocket.com/api/saves?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPocketSave(value)).toBeUndefined()
  })

  it('should return undefined for the button path on the main host', () => {
    const value = new URL('https://getpocket.com/v1/button?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPocketSave(value)).toBeUndefined()
  })

  it('should return undefined for a save path on the widget host', () => {
    const value = new URL('https://widgets.getpocket.com/save?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPocketSave(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/save?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPocketSave(value)).toBeUndefined()
  })
})
