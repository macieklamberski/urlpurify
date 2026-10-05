import { describe, expect, it } from 'bun:test'
import { unwrapMailRu } from './mailRu.js'

describe('unwrapMailRu', () => {
  it('should extract the target from a checklink proxy link', () => {
    const url = new URL(
      'https://checklink.mail.ru/proxy?es=IZZmJPhnht8nffVeEl4VN0Da1aOUR8Ji40CCk39HGO0%3D&egid=ZsjDAip33dKOzj4L38R6rqVwel%2FhS%2FHorHTPSxjGPEY%3D&url=https%3A%2F%2Fexample.com%2Fnews%2F&uidl=17811733771346611429&from=&to=&email=',
    )

    expect(unwrapMailRu(url)).toBe('https://example.com/news/')
  })

  it('should extract the target from a click.mail.ru link', () => {
    const url = new URL(
      'https://click.mail.ru/redir?u=https%3A%2F%2Fexample.com%2F20230211%2F1851409973.html&c=swm&r=http&o=mail&v=3&s=1137002976d040d0',
    )

    expect(unwrapMailRu(url)).toBe('https://example.com/20230211/1851409973.html')
  })

  it('should extract the target from a click.my.mail.ru link', () => {
    const url = new URL(
      'https://click.my.mail.ru/redir?u=http%3A%2F%2Fexample.com%2F&c=s&r=http&o=mm&e=1440777860&s=8dfa44849f2812e8',
    )

    expect(unwrapMailRu(url)).toBe('http://example.com/')
  })

  it('should return undefined when the checklink url is missing', () => {
    const url = new URL(
      'https://checklink.mail.ru/proxy?es=IZZmJPhnht8nffVeEl4VN0Da1aOUR8Ji40CCk39HGO0%3D',
    )

    expect(unwrapMailRu(url)).toBeUndefined()
  })

  it('should return undefined when the click u is missing', () => {
    const url = new URL('https://click.mail.ru/redir?c=swm&r=http&o=mail&v=3&s=1137002976d040d0')

    expect(unwrapMailRu(url)).toBeUndefined()
  })

  it('should return undefined for another path on the checklink host', () => {
    const url = new URL('https://checklink.mail.ru/redir?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapMailRu(url)).toBeUndefined()
  })

  it('should return undefined for another path on the click host', () => {
    const url = new URL('https://click.mail.ru/proxy?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapMailRu(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/redir?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapMailRu(url)).toBeUndefined()
  })
})
