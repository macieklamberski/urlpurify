import { describe, expect, it } from 'bun:test'
import { unwrapGoogleWebLight } from './googleWebLight.js'

describe('unwrapGoogleWebLight', () => {
  it('should extract target from lite_url param', () => {
    const value = new URL(
      'http://googleweblight.com/?lite_url=http://www.example.com/article/123906_1.html&lc=en-IN&s=1&m=43&host=www.google.co.in&ts=1472704942&sig=AKOVD64AiG8kBukmlDOl7Q6zeiDcpvJdWA',
    )
    const expected = 'http://www.example.com/article/123906_1.html'

    expect(unwrapGoogleWebLight(value)).toBe(expected)
  })

  it('should extract target from the page path', () => {
    const value = new URL(
      'https://googleweblight.com/i?u=https%3A%2F%2Fen.example.org%2Fwiki%2FAbraham_Lincoln&geid=NSTNR',
    )
    const expected = 'https://en.example.org/wiki/Abraham_Lincoln'

    expect(unwrapGoogleWebLight(value)).toBe(expected)
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'https://googleweblight.com/sp?hl&geid=NSTNR&u=https://en.example.org/wiki/',
    )

    expect(unwrapGoogleWebLight(value)).toBeUndefined()
  })

  it('should return undefined for lite_url on another path', () => {
    const value = new URL('http://googleweblight.com/sp?lite_url=http://www.example.com/')

    expect(unwrapGoogleWebLight(value)).toBeUndefined()
  })

  it('should return undefined when lite_url param is missing', () => {
    const value = new URL('http://googleweblight.com/?lc=en-IN&s=1')

    expect(unwrapGoogleWebLight(value)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const value = new URL('http://weblight.example.com/?lite_url=http://www.example.com/')

    expect(unwrapGoogleWebLight(value)).toBeUndefined()
  })
})
