import { describe, expect, it } from 'bun:test'
import { unwrapVkShare } from './vkShare.js'

describe('unwrapVkShare', () => {
  it('should extract a raw target', () => {
    const value = new URL('http://vk.com/share.php?url=http://example.com/pczxbje&title=')
    const expected = 'http://example.com/pczxbje'

    expect(unwrapVkShare(value)).toBe(expected)
  })

  it('should extract a percent-encoded target on vkontakte.ru', () => {
    const value = new URL(
      'https://vkontakte.ru/share.php?url=https%3A%2F%2Fexample.com%2Forchestre-de-paris-2%2F&title=Orchestre%20de%20Paris%20%232&description=BRAHMS%3A%20Serenade%20No',
    )
    const expected = 'https://example.com/orchestre-de-paris-2/'

    expect(unwrapVkShare(value)).toBe(expected)
  })

  it('should extract the target when url follows title', () => {
    const value = new URL(
      'https://vk.com/share.php?title=%D0%A1%D0%B0%D0%BC%D1%8B%D0%B5+%D0%BF%D0%B5%D0%B2%D0%B8%D1%86%D1%8B&url=http%3A%2F%2Fexample.com%2F1314',
    )
    const expected = 'http://example.com/1314'

    expect(unwrapVkShare(value)).toBe(expected)
  })

  it('should extract the page over the image url', () => {
    const value = new URL(
      'https://vk.com/share.php?url=https%3A%2F%2Fexample.com%2Fnew-blog%2F&image=https://example.com/storage/2022/04/cover.png&title=New+site',
    )
    const expected = 'https://example.com/new-blog/'

    expect(unwrapVkShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL('https://vk.com/share.php?url=https%253A%252F%252Fexample.com%252Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapVkShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://vk.com/Share.php?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapVkShare(value)).toBe(expected)
  })

  it('should return undefined when only the image url is given', () => {
    const value = new URL('https://vk.com/share.php?image=https%3A%2F%2Fexample.com%2Fcover.png')

    expect(unwrapVkShare(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://vk.com/share.php?url=&title=Title')

    expect(unwrapVkShare(value)).toBeUndefined()
  })

  it('should return undefined for the away redirect', () => {
    const value = new URL('https://vk.com/away.php?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapVkShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/share.php?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapVkShare(value)).toBeUndefined()
  })
})
