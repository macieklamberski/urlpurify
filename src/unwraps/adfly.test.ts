import { describe, expect, it } from 'bun:test'
import { unwrapAdfly } from './adfly.js'

describe('unwrapAdfly', () => {
  it('should extract a target with its scheme', () => {
    const url = new URL(
      'http://adf.ly/266435/http://www.example.com/download/16055490/song.mp3.html',
    )

    expect(unwrapAdfly(url)).toBe('http://www.example.com/download/16055490/song.mp3.html')
  })

  it('should extract a target with its scheme dropped', () => {
    const url = new URL(
      'http://adf.ly/13182869/www.example.com/pub/software/scm/git/docs/git-http-backend.html',
    )

    expect(unwrapAdfly(url)).toBe(
      'http://www.example.com/pub/software/scm/git/docs/git-http-backend.html',
    )
  })

  it('should extract a target after the banner segment', () => {
    const url = new URL('http://adf.ly/3897646/banner/example.com/media/BYT7mQsCYAAE_SS.jpg:large')

    expect(unwrapAdfly(url)).toBe('http://example.com/media/BYT7mQsCYAAE_SS.jpg:large')
  })

  it('should extract a target after the int segment', () => {
    const url = new URL('http://adf.ly/4778286/int/https://example.com/watch')

    expect(unwrapAdfly(url)).toBe('https://example.com/watch')
  })

  it('should keep the query and fragment of a target', () => {
    const url = new URL('http://adf.ly/95012/www.example.com/?d=JS47TMYS#top')

    expect(unwrapAdfly(url)).toBe('http://www.example.com/?d=JS47TMYS#top')
  })

  it('should return undefined for a target host cut short inside an escape', () => {
    const url = new URL('http://adf.ly/266435/http://www.example.com%2')

    expect(unwrapAdfly(url)).toBeUndefined()
  })

  it('should return undefined for a custom alias', () => {
    const url = new URL('http://adf.ly/6216564/element-animation-resource-pack')

    expect(unwrapAdfly(url)).toBeUndefined()
  })

  it('should return undefined for a short link', () => {
    const url = new URL('http://adf.ly/1aeu2J')

    expect(unwrapAdfly(url)).toBeUndefined()
  })

  it('should return undefined for a user id with no target', () => {
    const url = new URL('http://adf.ly/266435/')

    expect(unwrapAdfly(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/266435/www.example.org/download/song.mp3.html')

    expect(unwrapAdfly(url)).toBeUndefined()
  })
})
