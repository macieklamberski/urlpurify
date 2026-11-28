import { describe, expect, it } from 'bun:test'
import { unwrapRediffmail } from './rediffmail.js'

describe('unwrapRediffmail', () => {
  it('should extract target from red param', () => {
    const value = new URL(
      'http://www.rediffmail.com/cgi-bin/red.cgi?red=http%3A%2F%2Fwww%2Eexample%2Ecom%2FsDefinition%2F0%2C%2Csid21%5Fgci804744%2C00%2Ehtml&isImage=0&BlockImage=0',
    )
    const expected = 'http://www.example.com/sDefinition/0,,sid21_gci804744,00.html'

    expect(unwrapRediffmail(value)).toBe(expected)
  })

  it('should extract an unencoded target beside the signature', () => {
    const value = new URL(
      'https://www.rediffmail.com/cgi-bin/red.cgi?red=http://www.example.com&isImage=0&BlockImage=0&rediffng=0&rogue=71d3357ff8592ac6c21f5865f20568d77e717f5b',
    )
    const expected = 'http://www.example.com'

    expect(unwrapRediffmail(value)).toBe(expected)
  })

  it('should return undefined when red param is missing', () => {
    const value = new URL('http://www.rediffmail.com/cgi-bin/red.cgi?isImage=0&BlockImage=0')

    expect(unwrapRediffmail(value)).toBeUndefined()
  })

  it('should return undefined when red param is empty', () => {
    const value = new URL('http://www.rediffmail.com/cgi-bin/red.cgi?red=&isImage=0')

    expect(unwrapRediffmail(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'http://www.rediffmail.com/cgi-bin/login.cgi?red=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapRediffmail(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL(
      'http://www.example.com/cgi-bin/red.cgi?red=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapRediffmail(value)).toBeUndefined()
  })
})
