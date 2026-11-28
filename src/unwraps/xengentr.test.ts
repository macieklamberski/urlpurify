import { describe, expect, it } from 'bun:test'
import { unwrapXengentr } from './xengentr.js'

describe('unwrapXengentr', () => {
  it('should extract the target from the leaving redirect', () => {
    const value = new URL(
      'https://www.example.net/yonlendirme?to=aHR0cHM6Ly95YWRpLmV4YW1wbGUuY29tL2QvY19IN1VWS3lhcDNpQkE=',
    )
    const expected = 'https://yadi.example.com/d/c_H7UVKyap3iBA'

    expect(unwrapXengentr(value)).toBe(expected)
  })

  it('should read a raw plus of the base64 alphabet as a plus', () => {
    const value = new URL(
      'https://www.example.net/yonlendirme?to=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvIzp+OnRleHQ9VGhl',
    )
    const expected = 'https://www.example.org/#:~:text=The'

    expect(unwrapXengentr(value)).toBe(expected)
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'https://www.example.net/yonlendirme?to=ZnRwOi8vZXhhbXBsZS5jb20vZmlsZS50eHQ=',
    )

    expect(unwrapXengentr(value)).toBeUndefined()
  })

  it('should return undefined for a decoded target without a scheme', () => {
    const value = new URL('https://www.example.net/yonlendirme?to=d3d3LmV4YW1wbGUuY29tL3BhZ2U=')

    expect(unwrapXengentr(value)).toBeUndefined()
  })

  it('should return undefined for the leaving redirect without to', () => {
    const value = new URL('https://www.example.net/yonlendirme')

    expect(unwrapXengentr(value)).toBeUndefined()
  })

  it('should return undefined for a thread whose slug starts the same', () => {
    const value = new URL(
      'https://www.example.net/yonlendirme-oklari-t82166.html?to=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v',
    )

    expect(unwrapXengentr(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://www.example.net/yonlendirme?to=aHR0cHM6Ly95YWRpLmV4YW1wbGUuY29tL2QvY19IN1VWS3lhcDNpQkEjdG9w',
    )
    const expected = 'https://yadi.example.com/d/c_H7UVKyap3iBA#top'

    expect(unwrapXengentr(value)).toBe(expected)
  })
})
