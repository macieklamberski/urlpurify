import { describe, expect, it } from 'bun:test'
import { unwrapGroupMail } from './groupMail.js'

describe('unwrapGroupMail', () => {
  it('should extract target from the path', () => {
    const url = new URL('http://lnk.ie/100BX/e=member@example.org/https://www.example.com/p/rp927/')

    expect(unwrapGroupMail(url)).toBe('https://www.example.com/p/rp927/')
  })

  it('should extract a target whose scheme lost a slash', () => {
    const url = new URL('https://lnk.ie/7BKEQ/e=member@example.org/https:/www.example.com/europe/')

    expect(unwrapGroupMail(url)).toBe('https:/www.example.com/europe/')
  })

  it('should keep the target query and fragment', () => {
    const url = new URL(
      'http://lnk.ie/NEHU/e=member@example.org/http://www.example.com/grants.cfm?id=12#apply',
    )

    expect(unwrapGroupMail(url)).toBe('http://www.example.com/grants.cfm?id=12#apply')
  })

  it('should return undefined without a target', () => {
    const url = new URL('http://lnk.ie/NEHU/e=member@example.org/')

    expect(unwrapGroupMail(url)).toBeUndefined()
  })

  it('should return undefined without the recipient segment', () => {
    const url = new URL('http://lnk.ie/NEHU/https://www.example.com/')

    expect(unwrapGroupMail(url)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const url = new URL('http://lnk.example.com/NEHU/e=member@example.org/https://www.example.com/')

    expect(unwrapGroupMail(url)).toBeUndefined()
  })
})
