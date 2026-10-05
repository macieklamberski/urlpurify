import { describe, expect, it } from 'bun:test'
import { unwrapEdgepilot } from './edgepilot.js'

describe('unwrapEdgepilot', () => {
  it('should extract target from u param on the s path', () => {
    const url = new URL(
      'https://link.edgepilot.com/s/4239f747/ca21cbCpKkOSLI5ZXNqTdQ?u=https://www.example.com/StayConnected.html',
    )

    expect(unwrapEdgepilot(url)).toBe('https://www.example.com/StayConnected.html')
  })

  it('should extract target from u param on the x path', () => {
    const url = new URL(
      'https://link.edgepilot.com/x/zy7CWSADUoi2O9ZELfWL3hk?u=https://www.example.com/neuigkeiten/offener-kochtopf/',
    )

    expect(unwrapEdgepilot(url)).toBe('https://www.example.com/neuigkeiten/offener-kochtopf/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://link.edgepilot.com/s/215b833f/Cu2u929mYUSgw126rK7Lmw?u=https://example.org/?pg=cleevents%26evAction=showDetail%26eid=278577',
    )

    expect(unwrapEdgepilot(url)).toBe(
      'https://example.org/?pg=cleevents&evAction=showDetail&eid=278577',
    )
  })

  it('should extract target encoded once', () => {
    const url = new URL(
      'https://link.edgepilot.com/s/42823e5c/dgSM6YdTkkGarL_7xDGERw?u=https%3A%2F%2Fexample.com%2Fspecimen%2Fsimilar',
    )

    expect(unwrapEdgepilot(url)).toBe('https://example.com/specimen/similar')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://link.edgepilot.com/s/4239f747/ca21cbCpKkOSLI5ZXNqTdQ')

    expect(unwrapEdgepilot(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://link.edgepilot.com/report?u=https://example.com/page')

    expect(unwrapEdgepilot(url)).toBeUndefined()
  })

  it('should return undefined for the s path without its second id', () => {
    const url = new URL('https://link.edgepilot.com/s/4239f747?u=https://example.com/page')

    expect(unwrapEdgepilot(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/s/4239f747/ca21cbCpKkOSLI5ZXNqTdQ?u=https://example.org/page',
    )

    expect(unwrapEdgepilot(url)).toBeUndefined()
  })

  it('should return undefined for a path with a segment before the shape', () => {
    const url = new URL(
      'https://link.edgepilot.com/report/x/zy7CWSADUoi2O9ZELfWL3hk?u=https://example.com/page',
    )

    expect(unwrapEdgepilot(url)).toBeUndefined()
  })

  it('should return undefined for a path with a segment after the shape', () => {
    const url = new URL(
      'https://link.edgepilot.com/x/zy7CWSADUoi2O9ZELfWL3hk/report?u=https://example.com/page',
    )

    expect(unwrapEdgepilot(url)).toBeUndefined()
  })
})
