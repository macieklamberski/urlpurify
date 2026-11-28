import { describe, expect, it } from 'bun:test'
import { unwrapCanva } from './canva.js'

describe('unwrapCanva', () => {
  it('should extract target from target param', () => {
    const value = new URL(
      'https://www.canva.com/link?target=https%3A%2F%2Fwww.example.com%2Fquick-start%2Frun-test&design=DAHNSBlnxrY&accessRole=editor&linkSource=comment',
    )
    const expected = 'https://www.example.com/quick-start/run-test'

    expect(unwrapCanva(value)).toBe(expected)
  })

  it('should return undefined when target param is missing', () => {
    const value = new URL('https://www.canva.com/link?design=DAE1EGKj4MQ')

    expect(unwrapCanva(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://www.canva.com/design/DAE1EGKj4MQ/view?target=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapCanva(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/link?target=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapCanva(value)).toBeUndefined()
  })
})
