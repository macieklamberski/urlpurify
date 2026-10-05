import { describe, expect, it } from 'bun:test'
import { unwrapMediaad } from './mediaad.js'

describe('unwrapMediaad', () => {
  it('should extract target from redir param', () => {
    const url = new URL(
      'https://api.mediaad.org/v2/events/click?iid=13e81edd-51db-48fd-a3af-26e3c0fd8f58_620634x80672x0x94018&rid=620634&cid=80672&wid=94018&t=1764143158799&redir=https%3A%2F%2Fwww.example.com%2Fcar-driving-offence&h=5031&w=1903',
    )

    expect(unwrapMediaad(url)).toBe('https://www.example.com/car-driving-offence')
  })

  it('should return undefined when redir param is missing', () => {
    const url = new URL('https://api.mediaad.org/v2/events/click?iid=13e81edd&rid=620634&cid=80672')

    expect(unwrapMediaad(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Mediaad host', () => {
    const url = new URL(
      'https://api.mediaad.org/v2/events/impression?rid=620634&redir=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapMediaad(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/v2/events/click?rid=620634&redir=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapMediaad(url)).toBeUndefined()
  })
})
