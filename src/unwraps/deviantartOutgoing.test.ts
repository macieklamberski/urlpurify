import { describe, expect, it } from 'bun:test'
import { unwrapDeviantartOutgoing } from './deviantartOutgoing.js'

describe('unwrapDeviantartOutgoing', () => {
  it('should extract the unencoded target from the users outgoing path', () => {
    const url = new URL('https://www.deviantart.com/users/outgoing?https://example.com/shop')

    expect(unwrapDeviantartOutgoing(url)).toBe('https://example.com/shop')
  })

  it('should extract the target from a user outgoing path', () => {
    const url = new URL('https://www.deviantart.com/exampleuser/outgoing?https://example.com/shop')

    expect(unwrapDeviantartOutgoing(url)).toBe('https://example.com/shop')
  })

  it('should extract the target from the bare domain', () => {
    const url = new URL('https://deviantart.com/users/outgoing?https://example.com/shop')

    expect(unwrapDeviantartOutgoing(url)).toBe('https://example.com/shop')
  })

  it('should keep the fragment of the target', () => {
    const url = new URL('https://www.deviantart.com/users/outgoing?https://example.com/shop#top')

    expect(unwrapDeviantartOutgoing(url)).toBe('https://example.com/shop#top')
  })

  it('should return undefined when the query is empty', () => {
    const url = new URL('https://www.deviantart.com/users/outgoing')

    expect(unwrapDeviantartOutgoing(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://www.deviantart.com/users/login?https://example.com/shop')

    expect(unwrapDeviantartOutgoing(url)).toBeUndefined()
  })

  it('should return undefined for a path below outgoing', () => {
    const url = new URL('https://www.deviantart.com/users/outgoing/x?https://example.com/shop')

    expect(unwrapDeviantartOutgoing(url)).toBeUndefined()
  })

  it('should return undefined on a user subdomain', () => {
    const url = new URL(
      'https://exampleuser.deviantart.com/users/outgoing?https://example.com/shop',
    )

    expect(unwrapDeviantartOutgoing(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://exampledeviantart.com/users/outgoing?https://example.com/shop')

    expect(unwrapDeviantartOutgoing(url)).toBeUndefined()
  })
})
