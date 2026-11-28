import { describe, expect, it } from 'bun:test'
import { unwrapEvernote } from './evernote.js'

describe('unwrapEvernote', () => {
  it('should extract the target from the dest param', () => {
    const value = new URL(
      'https://www.evernote.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.com%2Fpub%2Fjane-doe%2F96%2Fb12%2F708',
    )
    const expected = 'https://www.example.com/pub/jane-doe/96/b12/708'

    expect(unwrapEvernote(value)).toBe(expected)
  })

  it('should extract the target of a link to the home page', () => {
    const value = new URL(
      'https://www.evernote.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapEvernote(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://www.evernote.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3Dnotes%26page%3D2',
    )
    const expected = 'https://www.example.com/search?q=notes&page=2'

    expect(unwrapEvernote(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://www.evernote.com/OutboundRedirect.action?dest=https://www.example.com/podcast/show/id976517340',
    )
    const expected = 'https://www.example.com/podcast/show/id976517340'

    expect(unwrapEvernote(value)).toBe(expected)
  })

  it('should extract the target of a plain http wrapper', () => {
    const value = new URL(
      'http://www.evernote.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapEvernote(value)).toBe(expected)
  })

  it('should return undefined when the dest param is missing', () => {
    const value = new URL('https://www.evernote.com/OutboundRedirect.action')

    expect(unwrapEvernote(value)).toBeUndefined()
  })

  it('should return undefined when the dest param is empty', () => {
    const value = new URL('https://www.evernote.com/OutboundRedirect.action?dest=')

    expect(unwrapEvernote(value)).toBeUndefined()
  })

  it('should return undefined for the clip intent on the host', () => {
    const value = new URL(
      'https://www.evernote.com/clip.action?url=https%3A%2F%2Fwww.example.com%2F&title=Example',
    )

    expect(unwrapEvernote(value)).toBeUndefined()
  })

  it('should return undefined for the note viewer on the host', () => {
    const value = new URL(
      'https://www.evernote.com/shard/s1/sh/abc?dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEvernote(value)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with the redirect path', () => {
    const value = new URL(
      'https://www.evernote.com/OutboundRedirect.action/x?dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEvernote(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapEvernote(value)).toBeUndefined()
  })
})
