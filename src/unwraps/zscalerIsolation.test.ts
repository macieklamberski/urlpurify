import { describe, expect, it } from 'bun:test'
import { unwrapZscalerIsolation } from './zscalerIsolation.js'

describe('unwrapZscalerIsolation', () => {
  it('should extract target from original_url param', () => {
    const url = new URL(
      'https://32290571.isolation.zscaler.com/profile/6d0d2d70-a110-4768-95fb-c406136beded/zia-session/?controls_id=0068ffc9-bec8-4f18-affb-baa84ae74f9f&region=cle&tenant=9bdf164cfefd&user=dc46385261a4cf8e&original_url=https%3a%2f%2fwww.example.com%2fcargo-theft%2f&key=sh-1&hmac=4a1b2c3d4e5f',
    )

    expect(unwrapZscalerIsolation(url)).toBe('https://www.example.com/cargo-theft/')
  })

  it('should return undefined when original_url param is missing', () => {
    const url = new URL(
      'https://32290571.isolation.zscaler.com/profile/6d0d2d70-a110-4768-95fb-c406136beded/zia-session/?tenant=9bdf164cfefd',
    )

    expect(unwrapZscalerIsolation(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://32290571.isolation.zscaler.com/profile/6d0d2d70-a110-4768-95fb-c406136beded/?original_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapZscalerIsolation(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://32290571.isolation.zscaler.com.example.com/profile/6d0d2d70-a110-4768-95fb-c406136beded/zia-session/?original_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapZscalerIsolation(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the domain', () => {
    const url = new URL(
      'https://example32290571.isolation.zscaler.com/profile/6d0d2d70-a110-4768-95fb-c406136beded/zia-session/?original_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapZscalerIsolation(url)).toBeUndefined()
  })
})
