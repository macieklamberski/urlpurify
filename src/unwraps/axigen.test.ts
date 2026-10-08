import { describe, expect, it } from 'bun:test'
import { unwrapAxigen } from './axigen.js'

describe('unwrapAxigen', () => {
  it('should extract a percent-encoded target', () => {
    const url = new URL(
      'http://mail.example.ro/redir.hsp?url=http%3A%2F%2Fwww.example.com%2Fcatalog%2Fcarte%2Fsint-o-baba-comunista%21-editia-2011---4300%2F',
    )

    expect(unwrapAxigen(url)).toBe(
      'http://www.example.com/catalog/carte/sint-o-baba-comunista!-editia-2011---4300/',
    )
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL('http://www.example.com/redir.hsp?url=https://example.org/search/a+b')

    expect(unwrapAxigen(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract an unencoded target', () => {
    const url = new URL('http://mail.example.mk/redir.hsp?url=https://www.example.com/')

    expect(unwrapAxigen(url)).toBe('https://www.example.com/')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'https://webmail.example.ac.ir/redir.hsp?url=http%3A%2F%2Fwww.example.com%2Furl%3Fsa%3Dt%26source%3Dweb',
    )

    expect(unwrapAxigen(url)).toBe('http://www.example.com/url?sa=t&source=web')
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL('https://webmail.example.ac.ir/index.hsp?url=http%3A%2F%2Fexample.com%2F')

    expect(unwrapAxigen(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://webmail.example.ac.ir/redir.hsp?url=mailto%3Ajane%40example.com')

    expect(unwrapAxigen(url)).toBeUndefined()
  })

  it('should return undefined when url is missing', () => {
    const url = new URL('https://webmail.example.ac.ir/redir.hsp')

    expect(unwrapAxigen(url)).toBeUndefined()
  })

  it('should return undefined when url is empty', () => {
    const url = new URL('https://webmail.example.ac.ir/redir.hsp?url=')

    expect(unwrapAxigen(url)).toBeUndefined()
  })
})
