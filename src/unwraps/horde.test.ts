import { describe, expect, it } from 'bun:test'
import { unwrapHorde } from './horde.js'

describe('unwrapHorde', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://webbmail.loopia.rs/horde/services/go.php?url=http%3A%2F%2Fwww.example.org%2Fnoticia.php%3Fid%3D140236',
    )
    const expected = 'http://www.example.org/noticia.php?id=140236'

    expect(unwrapHorde(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://www.example.com/horde/services/go.php?url=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapHorde(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://www.example.com/horde/services/go.php?url=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapHorde(value)).toBe(expected)
  })

  it('should extract target on a root install', () => {
    const value = new URL(
      'http://webmail.lutheran.hu/services/go.php?url=http%3A%2F%2Fwww.example.com%2Fmagyarvoroskereszt',
    )
    const expected = 'http://www.example.com/magyarvoroskereszt'

    expect(unwrapHorde(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'http://webmail.coqui.net/horde/services/go.php?url=https://www.example.com/',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapHorde(value)).toBe(expected)
  })

  it('should extract target from the Horde 3 util path beside the session id', () => {
    const value = new URL(
      'https://mymail.yorku.ca/horde/util/go.php?url=http%3A%2F%2Fieeexplore.example.org%2Fservlet%2Fopac%3Fpunumber%3D13%26isvol%3D52&Horde=13f67a1f82dd9e033e6b73b3c8f57eff',
    )
    const expected = 'http://ieeexplore.example.org/servlet/opac?punumber=13&isvol=52'

    expect(unwrapHorde(value)).toBe(expected)
  })

  it('should extract target from a numbered install directory', () => {
    const value = new URL(
      'https://webmail.hampshire.edu/horde2/util/go.php?url=http%3A%2F%2Fwww.example.at%2Fprix%2F&Horde2=9ac3a21171fc4b7a6fb03deb9f7ed4a2',
    )
    const expected = 'http://www.example.at/prix/'

    expect(unwrapHorde(value)).toBe(expected)
  })

  it('should return undefined for another script in services', () => {
    const value = new URL(
      'https://webbmail.loopia.rs/horde/services/download.php?url=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapHorde(value)).toBeUndefined()
  })

  it('should return undefined for a path below the script', () => {
    const value = new URL(
      'https://webbmail.loopia.rs/horde/services/go.php/extra?url=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapHorde(value)).toBeUndefined()
  })

  it('should return undefined for the path under two directories', () => {
    const value = new URL(
      'https://www.example.net/a/web/services/go.php?url=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapHorde(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'https://webbmail.loopia.rs/horde/services/go.php?url=javascript%3Aalert(1)',
    )

    expect(unwrapHorde(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://webbmail.loopia.rs/horde/services/go.php?Horde=0933bcb3')

    expect(unwrapHorde(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('https://webbmail.loopia.rs/horde/services/go.php?url=')

    expect(unwrapHorde(value)).toBeUndefined()
  })
})
