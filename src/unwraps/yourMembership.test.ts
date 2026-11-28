import { describe, expect, it } from 'bun:test'
import { unwrapYourMembership } from './yourMembership.js'

describe('unwrapYourMembership', () => {
  it('should extract target from finalurl param', () => {
    const value = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2859277&ymlink=103921985&finalurl=https%3A%2F%2Fbeta%2Eexample%2Egov%2Fdepartments%2Fmayors%2Doffice%2F',
    )
    const expected = 'https://beta.example.gov/departments/mayors-office/'

    expect(unwrapYourMembership(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2591478&ymlink=40386940&finalurl=https://www.example.com/about',
    )
    const expected = 'https://www.example.com/about'

    expect(unwrapYourMembership(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2591478&ymlink=40386940&finalurl=https://www.example.com/search/a+b',
    )
    const expected = 'https://www.example.com/search/a+b'

    expect(unwrapYourMembership(value)).toBe(expected)
  })

  it('should decode a twice-encoded target', () => {
    const value = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=3904796&ymlink=510233079&finalurl=https%253A%252F%252Fwww%252Eexample%252Ecom%252Fevents%252F',
    )
    const expected = 'https://www.example.com/events/'

    expect(unwrapYourMembership(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=3904796&ymlink=510233079&finalurl=https%253A%252F%252Fwww.example.com%252F100%25',
    )
    const expected = 'https://www.example.com/100%'

    expect(unwrapYourMembership(value)).toBe(expected)
  })

  it('should return undefined when finalurl param is missing', () => {
    const value = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2859277&ymlink=103921985',
    )

    expect(unwrapYourMembership(value)).toBeUndefined()
  })

  it('should return undefined for a non-http finalurl', () => {
    const value = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2859277&ymlink=103921985&finalurl=mailto%3Ainfo%40example%2Eorg',
    )

    expect(unwrapYourMembership(value)).toBeUndefined()
  })

  it('should return undefined without ymlink', () => {
    const value = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2859277&finalurl=https%3A%2F%2Fexample%2Ecom%2F',
    )

    expect(unwrapYourMembership(value)).toBeUndefined()
  })

  it('should return undefined for a non-numeric ymlink', () => {
    const value = new URL(
      'http://www.example.org/link.asp?ymlink=abc&finalurl=https%3A%2F%2Fexample%2Ecom%2F',
    )

    expect(unwrapYourMembership(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'http://www.example.org/content.asp?ymlink=103921985&finalurl=https%3A%2F%2Fexample%2Ecom%2F',
    )

    expect(unwrapYourMembership(value)).toBeUndefined()
  })
})
