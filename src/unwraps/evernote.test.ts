import { describe, expect, it } from 'bun:test'
import { unwrapEvernote } from './evernote.js'

describe('unwrapEvernote', () => {
  it('should extract the target from the dest param', () => {
    const url = new URL(
      'https://www.evernote.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.com%2Fpub%2Fjane-doe%2F96%2Fb12%2F708',
    )

    expect(unwrapEvernote(url)).toBe('https://www.example.com/pub/jane-doe/96/b12/708')
  })

  it('should extract the target of a link to the home page', () => {
    const url = new URL(
      'https://www.evernote.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEvernote(url)).toBe('https://www.example.com/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://www.evernote.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3Dnotes%26page%3D2',
    )

    expect(unwrapEvernote(url)).toBe('https://www.example.com/search?q=notes&page=2')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://www.evernote.com/OutboundRedirect.action?dest=https://www.example.com/podcast/show/id976517340',
    )

    expect(unwrapEvernote(url)).toBe('https://www.example.com/podcast/show/id976517340')
  })

  it('should extract the target of a plain http wrapper', () => {
    const url = new URL(
      'http://www.evernote.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEvernote(url)).toBe('https://www.example.com/')
  })

  it('should return undefined when the dest param is missing', () => {
    const url = new URL('https://www.evernote.com/OutboundRedirect.action')

    expect(unwrapEvernote(url)).toBeUndefined()
  })

  it('should return undefined when the dest param is empty', () => {
    const url = new URL('https://www.evernote.com/OutboundRedirect.action?dest=')

    expect(unwrapEvernote(url)).toBeUndefined()
  })

  it('should return undefined for the clip intent on the host', () => {
    const url = new URL(
      'https://www.evernote.com/clip.action?url=https%3A%2F%2Fwww.example.com%2F&title=Example',
    )

    expect(unwrapEvernote(url)).toBeUndefined()
  })

  it('should return undefined for the note viewer on the host', () => {
    const url = new URL(
      'https://www.evernote.com/shard/s1/sh/abc?dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEvernote(url)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with the redirect path', () => {
    const url = new URL(
      'https://www.evernote.com/OutboundRedirect.action/x?dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEvernote(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL(
      'https://www.example.com/OutboundRedirect.action?dest=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapEvernote(url)).toBeUndefined()
  })
})
