import { describe, expect, it } from 'bun:test'
import { unwrapGroupMail } from './groupMail.js'

describe('unwrapGroupMail', () => {
  it('should extract target from the path', () => {
    const value = new URL(
      'http://lnk.ie/100BX/e=member@example.org/https://www.example.com/p/rp927/',
    )
    const expected = 'https://www.example.com/p/rp927/'

    expect(unwrapGroupMail(value)).toBe(expected)
  })

  it('should extract a target whose scheme lost a slash', () => {
    const value = new URL(
      'https://lnk.ie/7BKEQ/e=member@example.org/https:/www.example.com/europe/',
    )
    const expected = 'https:/www.example.com/europe/'

    expect(unwrapGroupMail(value)).toBe(expected)
  })

  it('should keep the target query and fragment', () => {
    const value = new URL(
      'http://lnk.ie/NEHU/e=member@example.org/http://www.example.com/grants.cfm?id=12#apply',
    )
    const expected = 'http://www.example.com/grants.cfm?id=12#apply'

    expect(unwrapGroupMail(value)).toBe(expected)
  })

  it('should return undefined without a target', () => {
    const value = new URL('http://lnk.ie/NEHU/e=member@example.org/')

    expect(unwrapGroupMail(value)).toBeUndefined()
  })

  it('should return undefined without the recipient segment', () => {
    const value = new URL('http://lnk.ie/NEHU/https://www.example.com/')

    expect(unwrapGroupMail(value)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const value = new URL(
      'http://lnk.example.com/NEHU/e=member@example.org/https://www.example.com/',
    )

    expect(unwrapGroupMail(value)).toBeUndefined()
  })

  it('should decode a target whose slashes alone are encoded', () => {
    const value = new URL(
      'http://lnk.ie/100BX/e=member@example.org/https:%2F%2Fwww.example.com%2Fp%2Frp927%2F',
    )
    const expected = 'https://www.example.com/p/rp927/'

    expect(unwrapGroupMail(value)).toBe(expected)
  })
})
