import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapAdfly } from './adfly.js'

describe('unwrapAdfly', () => {
  it('should repair a target the CMS spaced after its scheme', () => {
    const value = 'https://adf.ly/123/http://%20https://www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapAdfly] })).toBe(expected)
  })

  it('should extract a target with its scheme', () => {
    const value = new URL(
      'http://adf.ly/266435/http://www.example.com/download/16055490/song.mp3.html',
    )
    const expected = 'http://www.example.com/download/16055490/song.mp3.html'

    expect(unwrapAdfly(value)).toBe(expected)
  })

  it('should extract a target with its scheme dropped', () => {
    const value = new URL(
      'http://adf.ly/13182869/www.example.com/pub/software/scm/git/docs/git-http-backend.html',
    )
    const expected = 'http://www.example.com/pub/software/scm/git/docs/git-http-backend.html'

    expect(unwrapAdfly(value)).toBe(expected)
  })

  it('should extract a target after the banner segment', () => {
    const value = new URL(
      'http://adf.ly/3897646/banner/example.com/media/BYT7mQsCYAAE_SS.jpg:large',
    )
    const expected = 'http://example.com/media/BYT7mQsCYAAE_SS.jpg:large'

    expect(unwrapAdfly(value)).toBe(expected)
  })

  it('should extract a target after the int segment', () => {
    const value = new URL('http://adf.ly/4778286/int/https://example.com/watch')
    const expected = 'https://example.com/watch'

    expect(unwrapAdfly(value)).toBe(expected)
  })

  it('should keep the query and fragment of a target', () => {
    const value = new URL('http://adf.ly/95012/www.example.com/?d=JS47TMYS#top')
    const expected = 'http://www.example.com/?d=JS47TMYS#top'

    expect(unwrapAdfly(value)).toBe(expected)
  })

  it('should keep the wrapper for a target host cut short inside an escape', () => {
    const value = 'http://adf.ly/266435/http://www.example.com%2'

    expect(purifyUrl(value, { unwrappers: [unwrapAdfly] })).toBe(value)
  })

  it('should return undefined for a custom alias', () => {
    const value = new URL('http://adf.ly/6216564/element-animation-resource-pack')

    expect(unwrapAdfly(value)).toBeUndefined()
  })

  it('should return undefined for a custom alias holding a dot', () => {
    const value = new URL('http://adf.ly/6216564/resource-pack.v2_final')

    expect(unwrapAdfly(value)).toBeUndefined()
  })

  it('should return undefined for a short link', () => {
    const value = new URL('http://adf.ly/1aeu2J')

    expect(unwrapAdfly(value)).toBeUndefined()
  })

  it('should return undefined for a user id with no target', () => {
    const value = new URL('http://adf.ly/266435/')

    expect(unwrapAdfly(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('http://example.com/266435/www.example.org/download/song.mp3.html')

    expect(unwrapAdfly(value)).toBeUndefined()
  })
})
