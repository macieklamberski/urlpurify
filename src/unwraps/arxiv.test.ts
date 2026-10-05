import { describe, expect, it } from 'bun:test'
import { unwrapArxiv } from './arxiv.js'

describe('unwrapArxiv', () => {
  it('should extract the target from the outbound redirect', () => {
    const url = new URL(
      'https://arxiv.org/ct?url=https%3A%2F%2Fdx.doi.org%2F10.1007%2F978-3-540-73750-6_9&v=26b6c80d',
    )

    expect(unwrapArxiv(url)).toBe('https://dx.doi.org/10.1007/978-3-540-73750-6_9')
  })

  it('should return undefined for the redirect without url', () => {
    const url = new URL('https://arxiv.org/ct?v=26b6c80d')

    expect(unwrapArxiv(url)).toBeUndefined()
  })

  it('should return undefined for an abstract page', () => {
    const url = new URL(
      'https://arxiv.org/abs/2101.00001?url=https%3A%2F%2Fdx.doi.org%2F10.1007%2Fx',
    )

    expect(unwrapArxiv(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/ct?url=https%3A%2F%2Fdx.doi.org%2F10.1007%2Fx')

    expect(unwrapArxiv(url)).toBeUndefined()
  })
})
