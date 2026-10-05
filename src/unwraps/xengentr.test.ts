import { describe, expect, it } from 'bun:test'
import { unwrapXengentr } from './xengentr.js'

describe('unwrapXengentr', () => {
  it('should extract the target from the leaving redirect', () => {
    const url = new URL(
      'https://www.example.net/yonlendirme?to=aHR0cHM6Ly95YWRpLmV4YW1wbGUuY29tL2QvY19IN1VWS3lhcDNpQkE=',
    )

    expect(unwrapXengentr(url)).toBe('https://yadi.example.com/d/c_H7UVKyap3iBA')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://www.example.net/yonlendirme?to=ZnRwOi8vZXhhbXBsZS5jb20vZmlsZS50eHQ=',
    )

    expect(unwrapXengentr(url)).toBeUndefined()
  })

  it('should return undefined for the leaving redirect without to', () => {
    const url = new URL('https://www.example.net/yonlendirme')

    expect(unwrapXengentr(url)).toBeUndefined()
  })

  it('should return undefined for a thread whose slug starts the same', () => {
    const url = new URL(
      'https://www.example.net/yonlendirme-oklari-t82166.html?to=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v',
    )

    expect(unwrapXengentr(url)).toBeUndefined()
  })
})
