import { describe, expect, it } from 'bun:test'
import { unwrapYourMembership } from './yourMembership.js'

describe('unwrapYourMembership', () => {
  it('should extract target from finalurl param', () => {
    const url = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2859277&ymlink=103921985&finalurl=https%3A%2F%2Fbeta%2Eexample%2Egov%2Fdepartments%2Fmayors%2Doffice%2F',
    )

    expect(unwrapYourMembership(url)).toBe('https://beta.example.gov/departments/mayors-office/')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2591478&ymlink=40386940&finalurl=https://www.example.com/about',
    )

    expect(unwrapYourMembership(url)).toBe('https://www.example.com/about')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2591478&ymlink=40386940&finalurl=https://www.example.com/search/a+b',
    )

    expect(unwrapYourMembership(url)).toBe('https://www.example.com/search/a+b')
  })

  it('should decode a twice-encoded target', () => {
    const url = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=3904796&ymlink=510233079&finalurl=https%253A%252F%252Fwww%252Eexample%252Ecom%252Fevents%252F',
    )

    expect(unwrapYourMembership(url)).toBe('https://www.example.com/events/')
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const url = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=3904796&ymlink=510233079&finalurl=https%253A%252F%252Fwww.example.com%252F100%25',
    )

    expect(unwrapYourMembership(url)).toBe('https://www.example.com/100%')
  })

  it('should return undefined when finalurl param is missing', () => {
    const url = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2859277&ymlink=103921985',
    )

    expect(unwrapYourMembership(url)).toBeUndefined()
  })

  it('should return undefined for a non-http finalurl', () => {
    const url = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2859277&ymlink=103921985&finalurl=mailto%3Ainfo%40example%2Eorg',
    )

    expect(unwrapYourMembership(url)).toBeUndefined()
  })

  it('should return undefined without ymlink', () => {
    const url = new URL(
      'http://www.example.org/link.asp?e=member@example.org&job=2859277&finalurl=https%3A%2F%2Fexample%2Ecom%2F',
    )

    expect(unwrapYourMembership(url)).toBeUndefined()
  })

  it('should return undefined for a non-numeric ymlink', () => {
    const url = new URL(
      'http://www.example.org/link.asp?ymlink=abc&finalurl=https%3A%2F%2Fexample%2Ecom%2F',
    )

    expect(unwrapYourMembership(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'http://www.example.org/content.asp?ymlink=103921985&finalurl=https%3A%2F%2Fexample%2Ecom%2F',
    )

    expect(unwrapYourMembership(url)).toBeUndefined()
  })
})
