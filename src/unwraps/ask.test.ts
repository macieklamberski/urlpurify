import { describe, expect, it } from 'bun:test'
import { unwrapAsk } from './ask.js'

describe('unwrapAsk', () => {
  it('should extract the target from a search result click', () => {
    const url = new URL(
      'http://wzus1.ask.com/r?t=a&d=us&s=a&c=a&app=a16&ti=1&ai=52431&l=sem&o=41647999&sv=0a5ca9e5&ip=47392dae&u=http%3A%2F%2Fen.example.org%2Fwiki%2FLightning',
    )

    expect(unwrapAsk(url)).toBe('http://en.example.org/wiki/Lightning')
  })

  it('should return undefined for a click without u', () => {
    const url = new URL('http://wzus.ask.com/r?t=p&d=us&s=a&c=a&l=dir&o=0&q=Web+2.0')

    expect(unwrapAsk(url)).toBeUndefined()
  })

  it('should return undefined for the framed result', () => {
    const url = new URL('http://wzus.ask.com/bar?q=jta&u=http%3A%2F%2Fwww.example.org%2F')

    expect(unwrapAsk(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/r?u=http%3A%2F%2Fwww.example.org%2F')

    expect(unwrapAsk(url)).toBeUndefined()
  })
})
