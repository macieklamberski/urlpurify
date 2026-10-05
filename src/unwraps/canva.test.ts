import { describe, expect, it } from 'bun:test'
import { unwrapCanva } from './canva.js'

describe('unwrapCanva', () => {
  it('should extract target from target param', () => {
    const url = new URL(
      'https://www.canva.com/link?target=https%3A%2F%2Fwww.example.com%2Fquick-start%2Frun-test&design=DAHNSBlnxrY&accessRole=editor&linkSource=comment',
    )

    expect(unwrapCanva(url)).toBe('https://www.example.com/quick-start/run-test')
  })

  it('should return undefined when target param is missing', () => {
    const url = new URL('https://www.canva.com/link?design=DAE1EGKj4MQ')

    expect(unwrapCanva(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://www.canva.com/design/DAE1EGKj4MQ/view?target=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapCanva(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/link?target=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapCanva(url)).toBeUndefined()
  })
})
