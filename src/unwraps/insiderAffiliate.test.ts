import { describe, expect, it } from 'bun:test'
import { unwrapInsiderAffiliate } from './insiderAffiliate.js'

describe('unwrapInsiderAffiliate', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://affiliate.insider.com/?amazonTrackingID=bi-auto-15126808416r5-20&h=d42bcad2&postID=6a4d2b5b70e21d8253fed7e9&postSlug=guides%2Ftickets%2Fbest-sites&u=https%3A%2F%2Fwww.example.com%2Ftickets%3Fid%3D1',
    )

    expect(unwrapInsiderAffiliate(url)).toBe('https://www.example.com/tickets?id=1')
  })

  it('should extract target from u param before other params', () => {
    const url = new URL(
      'https://affiliate.insider.com/?u=https%3A%2F%2Fwww.example.com%2Farticles%2Fglut-of-goods&amazonTrackingID=null&site=bi&platform=browser',
    )

    expect(unwrapInsiderAffiliate(url)).toBe('https://www.example.com/articles/glut-of-goods')
  })

  it('should extract target from the reviews out redirect', () => {
    const url = new URL(
      'https://www.businessinsider.com/reviews/out?platform=browser&postSource=bi%7C61fc3233f4e84b33245b44e8&sc=false&type=LINK-WITH-REVIEW-SLASH-OUT&u=https%3A%2F%2Fwww.example.com%2Fresale%2F',
    )

    expect(unwrapInsiderAffiliate(url)).toBe('https://www.example.com/resale/')
  })

  it('should return undefined for another reviews path on the Insider site', () => {
    const url = new URL(
      'https://www.businessinsider.com/reviews/best-mixers?u=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapInsiderAffiliate(url)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://affiliate.insider.com/?h=d42bcad2&postID=6a4d2b5b70e21d8253fed7e9')

    expect(unwrapInsiderAffiliate(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Insider host', () => {
    const url = new URL('https://affiliate.insider.com/redirect?u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapInsiderAffiliate(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/?h=d42bcad2&u=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapInsiderAffiliate(url)).toBeUndefined()
  })
})
