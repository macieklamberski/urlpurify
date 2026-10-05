import { describe, expect, it } from 'bun:test'
import { unwrapNetcentrum } from './netcentrum.js'

describe('unwrapNetcentrum', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'http://redir.netcentrum.cz/?noaudit&url=http%3A%2F%2Fwww%2Eexample%2Ecom%2Findex%2Ephp%3Fpage%3Ddetail%26event%5Fid%3D41',
    )

    expect(unwrapNetcentrum(url)).toBe('http://www.example.com/index.php?page=detail&event_id=41')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('http://redir.netcentrum.cz/?noaudit')

    expect(unwrapNetcentrum(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('http://redir.netcentrum.cz/?noaudit&url=')

    expect(unwrapNetcentrum(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('http://redir.netcentrum.cz/redir?url=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapNetcentrum(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('http://redir.example.com/?noaudit&url=http%3A%2F%2Fwww.example.org%2F')

    expect(unwrapNetcentrum(url)).toBeUndefined()
  })
})
