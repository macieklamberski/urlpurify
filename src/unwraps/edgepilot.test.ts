import { describe, expect, it } from 'bun:test'
import { unwrapEdgepilot } from './edgepilot.js'

describe('unwrapEdgepilot', () => {
  it('should extract target from u param on the s path', () => {
    const value = new URL(
      'https://link.edgepilot.com/s/4239f747/ca21cbCpKkOSLI5ZXNqTdQ?u=https://www.example.com/StayConnected.html',
    )
    const expected = 'https://www.example.com/StayConnected.html'

    expect(unwrapEdgepilot(value)).toBe(expected)
  })

  it('should extract target from u param on the x path', () => {
    const value = new URL(
      'https://link.edgepilot.com/x/zy7CWSADUoi2O9ZELfWL3hk?u=https://www.example.com/neuigkeiten/offener-kochtopf/',
    )
    const expected = 'https://www.example.com/neuigkeiten/offener-kochtopf/'

    expect(unwrapEdgepilot(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://link.edgepilot.com/s/215b833f/Cu2u929mYUSgw126rK7Lmw?u=https://example.org/?pg=cleevents%26evAction=showDetail%26eid=278577',
    )
    const expected = 'https://example.org/?pg=cleevents&evAction=showDetail&eid=278577'

    expect(unwrapEdgepilot(value)).toBe(expected)
  })

  it('should extract target encoded once', () => {
    const value = new URL(
      'https://link.edgepilot.com/s/42823e5c/dgSM6YdTkkGarL_7xDGERw?u=https%3A%2F%2Fexample.com%2Fspecimen%2Fsimilar',
    )
    const expected = 'https://example.com/specimen/similar'

    expect(unwrapEdgepilot(value)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://link.edgepilot.com/s/4239f747/ca21cbCpKkOSLI5ZXNqTdQ')

    expect(unwrapEdgepilot(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://link.edgepilot.com/report?u=https://example.com/page')

    expect(unwrapEdgepilot(value)).toBeUndefined()
  })

  it('should return undefined for the s path without its second id', () => {
    const value = new URL('https://link.edgepilot.com/s/4239f747?u=https://example.com/page')

    expect(unwrapEdgepilot(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/s/4239f747/ca21cbCpKkOSLI5ZXNqTdQ?u=https://example.org/page',
    )

    expect(unwrapEdgepilot(value)).toBeUndefined()
  })

  it('should return undefined for a path with a segment before the shape', () => {
    const value = new URL(
      'https://link.edgepilot.com/report/x/zy7CWSADUoi2O9ZELfWL3hk?u=https://example.com/page',
    )

    expect(unwrapEdgepilot(value)).toBeUndefined()
  })

  it('should return undefined for a path with a segment after the shape', () => {
    const value = new URL(
      'https://link.edgepilot.com/x/zy7CWSADUoi2O9ZELfWL3hk/report?u=https://example.com/page',
    )

    expect(unwrapEdgepilot(value)).toBeUndefined()
  })
})
