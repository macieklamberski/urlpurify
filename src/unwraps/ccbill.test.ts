import { describe, expect, it } from 'bun:test'
import { unwrapCcbill } from './ccbill.js'

describe('unwrapCcbill', () => {
  it('should extract a plain target from HTML', () => {
    const url = new URL(
      'http://refer.ccbill.com/cgi-bin/clicks.cgi?CA=901313&PA=1489399&HTML=http://www.example.com/?PA=1489399',
    )

    expect(unwrapCcbill(url)).toBe('http://www.example.com/?PA=1489399')
  })

  it('should extract a target from lowercase html', () => {
    const url = new URL(
      'http://refer.ccbill.com/cgi-bin/clicks.cgi?CA=927141-0000&PA=2159103&html=http://hosted.example.com/galleries/115663_pmb032_pjc642?affid=2159103',
    )

    expect(unwrapCcbill(url)).toBe(
      'http://hosted.example.com/galleries/115663_pmb032_pjc642?affid=2159103',
    )
  })

  it('should extract a percent-encoded target from HTML', () => {
    const url = new URL(
      'https://refer.ash1.ccbill.com/cgi-bin/clicks.cgi?CA=933914&PA=1785830&HTML=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapCcbill(url)).toBe('http://www.example.com/')
  })

  it('should return undefined when no carrier is present', () => {
    const url = new URL('http://refer.ccbill.com/cgi-bin/clicks.cgi?CA=920029&PA=664334')

    expect(unwrapCcbill(url)).toBeUndefined()
  })

  it('should return undefined for a stray segment after the script path', () => {
    const url = new URL(
      'https://refer.ccbill.com/cgi-bin/clicks.cgi/http:/?CA=928498&PA=1458253&HTML=http%3A%2F%2Fwww.example.com',
    )

    expect(unwrapCcbill(url)).toBeUndefined()
  })

  it('should return undefined for the shape on a non-CCBill host', () => {
    const url = new URL(
      'https://example.com/cgi-bin/clicks.cgi?CA=901313&PA=1489399&HTML=http://www.example.org/',
    )

    expect(unwrapCcbill(url)).toBeUndefined()
  })
})
