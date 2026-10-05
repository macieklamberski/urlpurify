import { describe, expect, it } from 'bun:test'
import { unwrapKlook } from './klook.js'

describe('unwrapKlook', () => {
  it('should extract the target from the k_site param', () => {
    const url = new URL(
      'https://affiliate.klook.com/redirect?aid=99683&aff_adid=1134759&k_site=https%3A%2F%2Fwww.example.com%2Fzh-TW%2Factivity%2F20707-admission-ticket-tokyo',
    )

    expect(unwrapKlook(url)).toBe(
      'https://www.example.com/zh-TW/activity/20707-admission-ticket-tokyo',
    )
  })

  it('should extract the target of a link to the home page', () => {
    const url = new URL(
      'https://affiliate.klook.com/redirect?aid=32586&aff_adid=997632&k_site=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapKlook(url)).toBe('https://www.example.com/')
  })

  it('should extract target from a plain http wrapper', () => {
    const url = new URL(
      'http://affiliate.klook.com/redirect?aid=1&k_site=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapKlook(url)).toBe('https://www.example.com/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://affiliate.klook.com/redirect?aid=4288&aff_adid=658827&k_site=https%3A%2F%2Fwww.example.com%2Fsearch%2Fresult%2F%3Fquery%3Dhanoi%26spm%3DSearchResult',
    )

    expect(unwrapKlook(url)).toBe(
      'https://www.example.com/search/result/?query=hanoi&spm=SearchResult',
    )
  })

  it('should extract target when the k_site param comes first', () => {
    const url = new URL(
      'https://affiliate.klook.com/redirect?k_site=https%3A%2F%2Fwww.example.com%2F&aid=1',
    )

    expect(unwrapKlook(url)).toBe('https://www.example.com/')
  })

  it('should extract the last target when the link is pasted into another one', () => {
    const url = new URL(
      'https://affiliate.klook.com/redirect?aid=7230&k_site=https%3A%2F%2Fwww.example.com%2Factivity%2F17872-cooking%2Fhttps%3A%2F%2Faffiliate.klook.com%2Fredirect%3Faid%3D7230&k_site=https%3A%2F%2Fwww.example.com%2Factivity%2F17872-cooking%2F',
    )

    expect(unwrapKlook(url)).toBe('https://www.example.com/activity/17872-cooking/')
  })

  it('should return undefined when the k_site param is missing', () => {
    const url = new URL('https://affiliate.klook.com/redirect?aid=1&aff_adid=2')

    expect(unwrapKlook(url)).toBeUndefined()
  })

  it('should return undefined when the k_site param is empty', () => {
    const url = new URL('https://affiliate.klook.com/redirect?aid=1&k_site=')

    expect(unwrapKlook(url)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const url = new URL(
      'https://affiliate.klook.com/redirect?aid=1&k_site=ftp%3A%2F%2Fexample.com%2Ffile.zip',
    )

    expect(unwrapKlook(url)).toBeUndefined()
  })

  it('should return undefined for the redirect path without params', () => {
    const url = new URL('https://affiliate.klook.com/redirect')

    expect(unwrapKlook(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://affiliate.klook.com/click?k_site=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapKlook(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL(
      'https://example.com/redirect?aid=1&k_site=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapKlook(url)).toBeUndefined()
  })
})
