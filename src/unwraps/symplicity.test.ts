import { describe, expect, it } from 'bun:test'
import { unwrapSymplicity } from './symplicity.js'

describe('unwrapSymplicity', () => {
  it('should extract target from a ct link', () => {
    const url = new URL(
      'https://ct.symplicity.com/t/wrn/c0b32e76349e84a5810df0fc84add962/3447045299/realurl=https://www.example.gov/news/press-releases/hearing',
    )

    expect(unwrapSymplicity(url)).toBe('https://www.example.gov/news/press-releases/hearing')
  })

  it('should extract target from a career services track link', () => {
    const url = new URL(
      'https://law-pacific-csm.symplicity.com/track/a17b86fa1f98502aa1610f563e3bd07d/2486062942/realurl=http:/www.example.gov/Admissions/Special-Admissions',
    )

    expect(unwrapSymplicity(url)).toBe('http:/www.example.gov/Admissions/Special-Admissions')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'http://ct.symplicity.com/t/crz/15638c7c3741d822ae58cbd793f741ad/2080912420/realurl=http://www.example.gov/record.cfm?id=342974#top',
    )

    expect(unwrapSymplicity(url)).toBe('http://www.example.gov/record.cfm?id=342974#top')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://ct.symplicity.com/t/wrn/c0b32e76349e84a5810df0fc84add962/3447045299/realurl=mailto:office@example.gov',
    )

    expect(unwrapSymplicity(url)).toBeUndefined()
  })

  it('should return undefined for a link id that is not 32 hex characters', () => {
    const url = new URL(
      'https://ct.symplicity.com/t/wrn/c0b32e76/3447045299/realurl=https://www.example.gov/',
    )

    expect(unwrapSymplicity(url)).toBeUndefined()
  })

  it('should return undefined for another path on a career services host', () => {
    const url = new URL(
      'https://umd-csm.symplicity.com/events/855e6e7ae91f8fa4410cb1b0e0e93dda/overview',
    )

    expect(unwrapSymplicity(url)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const url = new URL(
      'https://ct.symplicity.com/x/t/wrn/c0b32e76349e84a5810df0fc84add962/3447045299/realurl=https://www.example.gov/',
    )

    expect(unwrapSymplicity(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL(
      'https://example.com/t/wrn/c0b32e76349e84a5810df0fc84add962/3447045299/realurl=https://www.example.gov/',
    )

    expect(unwrapSymplicity(url)).toBeUndefined()
  })

  it('should return undefined for a link with a non-numeric send id', () => {
    const url = new URL(
      'https://ct.symplicity.com/t/wrn/c0b32e76349e84a5810df0fc84add962/x3447045299/realurl=https://www.example.gov/',
    )

    expect(unwrapSymplicity(url)).toBeUndefined()
  })
})
