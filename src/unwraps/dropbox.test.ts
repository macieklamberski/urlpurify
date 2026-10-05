import { describe, expect, it } from 'bun:test'
import { unwrapDropbox } from './dropbox.js'

describe('unwrapDropbox', () => {
  it('should extract target from referrer_cleansing_redirect', () => {
    const url = new URL(
      'https://www.dropbox.com/referrer_cleansing_redirect?hmac=aFROs52xgkrIp42Nlsjrh5whwMqvO4YH%2B3eXzOOnU6M%3D&url=http%3A%2F%2Fwww.example.com%2Fportfolio',
    )

    expect(unwrapDropbox(url)).toBe('http://www.example.com/portfolio')
  })

  it('should extract an unencoded target from referrer_cleansing_redirect', () => {
    const url = new URL(
      'https://www.dropbox.com/referrer_cleansing_redirect?hmac=o8TeChgmCtkPA5cNYpjsQmiX8TGOpuKlC5OWwd34VVY%3D&url=https://www.example.com/',
    )

    expect(unwrapDropbox(url)).toBe('https://www.example.com/')
  })

  it('should extract target from the Paper external link', () => {
    const url = new URL(
      'https://www.dropbox.com/paper/ep/redirect/external-link?url=https%3A%2F%2Fwww.example.com%2Fe%2Fcelebration-tickets-571089593347%3Faff%3Debdssbdestsear&hmac=QWJzJbT5n0Y4Y0RZoQ1e1N0P5j4mJ0hJk2k7Wm2h0aE%3D',
    )

    expect(unwrapDropbox(url)).toBe(
      'https://www.example.com/e/celebration-tickets-571089593347?aff=ebdssbdestsear',
    )
  })

  it('should extract target from the Paper external link on paper.dropbox.com', () => {
    const url = new URL(
      'http://paper.dropbox.com/ep/redirect/external-link?url=https%3A%2F%2Fwww.example.com%2F&hmac=wLndMkoNF0G3N3IlXVQaVEaArDaa3m8o0Q7m8sYH4Lk%3D',
    )

    expect(unwrapDropbox(url)).toBe('https://www.example.com/')
  })

  it('should return undefined for the Paper image redirect', () => {
    const url = new URL(
      'https://paper.dropbox.com/ep/redirect/image?url=https%3A%2F%2Fcdn.example.com%2Fmax%2F2400%2Fimage.gif&hmac=8pEiHV9QqzddW1vJ1r2laTIew3HH6e3zJIT',
    )

    expect(unwrapDropbox(url)).toBeUndefined()
  })

  it('should return undefined for a shared file with a url param', () => {
    const url = new URL('https://www.dropbox.com/s/abc/file.pdf?url=https://www.example.com')

    expect(unwrapDropbox(url)).toBeUndefined()
  })

  it('should return undefined for the login return url', () => {
    const url = new URL(
      'https://www.dropbox.com/login?cont=https%3A%2F%2Fwww.dropbox.com%2Fdevelopers%2Fapps',
    )

    expect(unwrapDropbox(url)).toBeUndefined()
  })

  it('should return undefined for the redirect path on another host', () => {
    const url = new URL(
      'https://www.example.com/referrer_cleansing_redirect?url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapDropbox(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL(
      'https://www.dropbox.com/referrer_cleansing_redirect?hmac=aFROs52xgkrIp42Nlsjrh5whwMqvO4YH%2B3eXzOOnU6M%3D',
    )

    expect(unwrapDropbox(url)).toBeUndefined()
  })
})
