import { describe, expect, it } from 'bun:test'
import { unwrapEvernoteClip } from './evernoteClip.js'

describe('unwrapEvernoteClip', () => {
  it('should extract an encoded page from a clip link', () => {
    const value = new URL(
      'http://www.evernote.com/clip.action?url=https%3A%2F%2Fexample.com%2Fgood-strategy-does-not-fail-it-gets-killed-before-it-can-work%2F',
    )
    const expected =
      'https://example.com/good-strategy-does-not-fail-it-gets-killed-before-it-can-work/'

    expect(unwrapEvernoteClip(value)).toBe(expected)
  })

  it('should extract an encoded page before a title', () => {
    const value = new URL(
      'https://www.evernote.com/clip.action?url=https%3A%2F%2Fwww.example.com%2F2024%2F11%2F15%2Fnisana-kac-var%2F&title=Nisan%26%238217%3Ba+Ka%C3%A7+Var',
    )
    const expected = 'https://www.example.com/2024/11/15/nisana-kac-var/'

    expect(unwrapEvernoteClip(value)).toBe(expected)
  })

  it('should extract an unencoded page cut at the title', () => {
    const value = new URL(
      'http://www.evernote.com/clip.action?url=https://example.com/2016/08/11/activations-from-procida-s-island/&title=Activations%20from%20Procida%27s%20island',
    )
    const expected = 'https://example.com/2016/08/11/activations-from-procida-s-island/'

    expect(unwrapEvernoteClip(value)).toBe(expected)
  })

  it('should extract a page from the bare host', () => {
    const value = new URL('https://evernote.com/clip.action?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapEvernoteClip(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL(
      'https://www.evernote.com/clip.action?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapEvernoteClip(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://www.evernote.com/Clip.action?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapEvernoteClip(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://www.evernote.com/clip.action?title=Hello')

    expect(unwrapEvernoteClip(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://www.evernote.com/clip.action?url=&title=Hello')

    expect(unwrapEvernoteClip(value)).toBeUndefined()
  })

  it('should return undefined for a page held only in the title', () => {
    const value = new URL(
      'https://www.evernote.com/clip.action?url=&title=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapEvernoteClip(value)).toBeUndefined()
  })

  it('should return undefined for a page held only in the body', () => {
    const value = new URL(
      'https://www.evernote.com/clip.action?url=&body=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapEvernoteClip(value)).toBeUndefined()
  })

  it('should return undefined for the outbound redirect path', () => {
    const value = new URL(
      'https://www.evernote.com/OutboundRedirect.action?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapEvernoteClip(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/clip.action?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapEvernoteClip(value)).toBeUndefined()
  })
})
