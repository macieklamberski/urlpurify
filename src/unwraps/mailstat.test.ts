import { describe, expect, it } from 'bun:test'
import { unwrapMailstat } from './mailstat.js'

describe('unwrapMailstat', () => {
  it('should extract target from a t link', () => {
    const value = new URL(
      'https://mailstat.us/tr/t/vl6g8n5iko528ta4/1m/https://www.example.com/page',
    )
    const expected = 'https://www.example.com/page'

    expect(unwrapMailstat(value)).toBe(expected)
  })

  it('should extract target from a t2 link', () => {
    const value = new URL(
      'https://mailstat.us/tr/t2/8f5fdda/qajqabnstfrbic/3/https://example.com/join',
    )
    const expected = 'https://example.com/join'

    expect(unwrapMailstat(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://mailstat.us/tr/t/sg3e7prem0gph37u/1/https://example.com/ticket/?mc_cid=5cee7ed1bb#/events/a0SU1000002UsbJMAS',
    )
    const expected = 'https://example.com/ticket/?mc_cid=5cee7ed1bb#/events/a0SU1000002UsbJMAS'

    expect(unwrapMailstat(value)).toBe(expected)
  })

  it('should return a single-slash target as written', () => {
    const value = new URL('https://mailstat.us/tr/t/vfsvqvlblsokackj/1e/http:/www.example.com/')
    const expected = 'http:/www.example.com/'

    expect(unwrapMailstat(value)).toBe(expected)
  })

  it('should return undefined for an open pixel', () => {
    const value = new URL('https://mailstat.us/tr/o/vl6g8n5iko528ta4.gif')

    expect(unwrapMailstat(value)).toBeUndefined()
  })

  it('should return undefined for a link without a target', () => {
    const value = new URL('https://mailstat.us/tr/t/vl6g8n5iko528ta4/1m/')

    expect(unwrapMailstat(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL('https://mailstat.us/tr/t/vl6g8n5iko528ta4/1m/mailto:hello@example.com')

    expect(unwrapMailstat(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL(
      'https://example.com/tr/t/vl6g8n5iko528ta4/1m/https://www.example.com/page',
    )

    expect(unwrapMailstat(value)).toBeUndefined()
  })

  it('should keep a target that holds another url in its path', () => {
    const value = new URL(
      'https://mailstat.us/tr/t/vl6g8n5iko528ta4/1m/https://web.archive.org/web/2020/https://example.com/',
    )
    const expected = 'https://web.archive.org/web/2020/https://example.com/'

    expect(unwrapMailstat(value)).toBe(expected)
  })

  it('should return undefined for a t2 link with a non-numeric position', () => {
    const value = new URL(
      'https://mailstat.us/tr/t2/8f5fdda/qajqabnstfrbic/x3/https://example.com/join',
    )

    expect(unwrapMailstat(value)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const value = new URL(
      'https://mailstat.us/x/tr/t/vl6g8n5iko528ta4/1m/https://www.example.com/page',
    )

    expect(unwrapMailstat(value)).toBeUndefined()
  })
})
