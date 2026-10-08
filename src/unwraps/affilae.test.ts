import { describe, expect, it } from 'bun:test'
import { unwrapAffilae } from './affilae.js'

describe('unwrapAffilae', () => {
  it('should extract a plain target from lp param', () => {
    const url = new URL(
      'https://lb.affilae.com/r/?p=61b9aae6d4b9873f6d45ef3d&af=117&lp=https://www.example.com/pneu-hiver/%3Futm_source%3Daffilae',
    )

    expect(unwrapAffilae(url)).toBe('https://www.example.com/pneu-hiver/?utm_source=affilae')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://lb.affilae.com/r/?p=61b9aae6d4b9873f6d45ef3d&af=117&lp=https://example.org/search/a+b',
    )

    expect(unwrapAffilae(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract a percent-encoded target from lp param', () => {
    const url = new URL(
      'https://lb.affilae.com/r/?p=5bed8ee5202f107c44c3512d&af=322&ad=18&lp=https%3A%2F%2Fwww.example.com%2Fbox-enfants-7-11',
    )

    expect(unwrapAffilae(url)).toBe('https://www.example.com/box-enfants-7-11')
  })

  it('should extract the last lp when an Affilae click is nested unencoded', () => {
    const url = new URL(
      'https://lb.affilae.com/r/?p=636a7d6342a98646600f93cc&af=8&lp=https://lb.affilae.com/r/?p=636a7d6342a98646600f93cc&af=8&lp=https://www.example.com/lk-samyang-af-60-180mm.html%3Fref%3D48392',
    )

    expect(unwrapAffilae(url)).toBe('https://www.example.com/lk-samyang-af-60-180mm.html?ref=48392')
  })

  it('should return undefined when lp param is missing', () => {
    const url = new URL('https://lb.affilae.com/r/?p=61b9aae6d4b9873f6d45ef3d&af=117')

    expect(unwrapAffilae(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Affilae host', () => {
    const url = new URL(
      'https://lb.affilae.com/c/?p=61b9aae6d4b9873f6d45ef3d&lp=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAffilae(url)).toBeUndefined()
  })

  it('should return undefined for the impression path', () => {
    const url = new URL(
      'https://lb.affilae.com/imp/5cffbcf08cc78b2f692b1be0/68a579b214ca1ed8b1ac3600/694956eafcdcab6225571858/https://www.example.com/banner.jpg',
    )

    expect(unwrapAffilae(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/r/?p=1&af=2&lp=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapAffilae(url)).toBeUndefined()
  })
})
