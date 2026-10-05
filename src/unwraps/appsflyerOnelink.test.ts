import { describe, expect, it } from 'bun:test'
import { unwrapAppsflyerOnelink } from './appsflyerOnelink.js'

describe('unwrapAppsflyerOnelink', () => {
  it('should extract target from af_web_dp on a template path', () => {
    const url = new URL(
      'https://foxnews.onelink.me/xLDS?pid=AppArticleLink&af_dp=foxnewsaf%3A%2F%2F&af_web_dp=https%3A%2F%2Fwww.example.com%2Fapps-products',
    )

    expect(unwrapAppsflyerOnelink(url)).toBe('https://www.example.com/apps-products')
  })

  it('should extract target from af_web_dp on a short link path', () => {
    const url = new URL(
      'https://changelly.onelink.me/8Lhn/4kydbs5r?af_web_dp=https%3A%2F%2Fexample.com%2Fbuy%2Flayer%2F%3Futm_medium%3Dweb',
    )

    expect(unwrapAppsflyerOnelink(url)).toBe('https://example.com/buy/layer/?utm_medium=web')
  })

  it('should return undefined when only store links are present', () => {
    const url = new URL(
      'https://foxnews.onelink.me/xLDS?af_android_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.example',
    )

    expect(unwrapAppsflyerOnelink(url)).toBeUndefined()
  })

  it('should return undefined for af_web_dp on a deeper path', () => {
    const url = new URL(
      'https://foxnews.onelink.me/xLDS/abc/def?af_web_dp=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAppsflyerOnelink(url)).toBeUndefined()
  })

  it('should return undefined for af_web_dp on the bare onelink.me host', () => {
    const url = new URL('https://onelink.me/xLDS?af_web_dp=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAppsflyerOnelink(url)).toBeUndefined()
  })

  it('should return undefined for af_web_dp on a nested subdomain', () => {
    const url = new URL('https://a.b.onelink.me/xLDS?af_web_dp=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAppsflyerOnelink(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with onelink.me', () => {
    const url = new URL(
      'https://brand.exampleonelink.me/xLDS?af_web_dp=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAppsflyerOnelink(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with onelink.me', () => {
    const url = new URL(
      'https://brand.onelink.me.example.com/xLDS?af_web_dp=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAppsflyerOnelink(url)).toBeUndefined()
  })
})
