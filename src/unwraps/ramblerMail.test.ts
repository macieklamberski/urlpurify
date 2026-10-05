import { describe, expect, it } from 'bun:test'
import { unwrapRamblerMail } from './ramblerMail.js'

describe('unwrapRamblerMail', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://mail.rambler.ru/m/redirect?url=http%3A//www.example.com/&hash=c0002992f9ab98144efebcf64ab44157',
    )

    expect(unwrapRamblerMail(url)).toBe('http://www.example.com/')
  })

  it('should extract a fully encoded target without the hash', () => {
    const url = new URL(
      'https://mail.rambler.ru/m/redirect?url=https%3A%2F%2Fwww.example.com%2Fpost',
    )

    expect(unwrapRamblerMail(url)).toBe('https://www.example.com/post')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://mail.rambler.ru/m/redirect?hash=c0002992f9ab98144efebcf64ab44157')

    expect(unwrapRamblerMail(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://mail.rambler.ru/m/redirect?url=')

    expect(unwrapRamblerMail(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://mail.rambler.ru/mail/redirect.cgi?url=http%3A//www.example.com/')

    expect(unwrapRamblerMail(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://mail.example.com/m/redirect?url=http%3A//www.example.org/')

    expect(unwrapRamblerMail(url)).toBeUndefined()
  })
})
