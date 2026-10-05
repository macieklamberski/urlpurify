import { describe, expect, it } from 'bun:test'
import { unwrapHornetsecurity } from './hornetsecurity.js'

describe('unwrapHornetsecurity', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://atpscan.global.hornetsecurity.com/?d=HzV-JpXnCxhoHNXVsqolz4M0beD_W__mzkLaX14YOBo&f=rhmYUrUT0yf7_MqAWYauWl9Qk-Rt-6T3&i=&k=Eb5a&m=onuRfVBv2LRuvGtUPX&n=Ux5fGkGCM9zp&r=nfZ6YyZoQjx8&s=a1b0c48e0c4f1d8e&u=https%3A%2F%2Fwww.example.com%2Fnews%2F',
    )

    expect(unwrapHornetsecurity(url)).toBe('https://www.example.com/news/')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL(
      'https://atpscan.global.hornetsecurity.com/?d=HzV-JpXnCxhoHNXVsqolz4M0beD_W__mzkLaX14YOBo&f=rhmYUrUT0yf7',
    )

    expect(unwrapHornetsecurity(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://atpscan.global.hornetsecurity.com/report?u=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapHornetsecurity(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/?u=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapHornetsecurity(url)).toBeUndefined()
  })
})
