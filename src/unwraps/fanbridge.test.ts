import { describe, expect, it } from 'bun:test'
import { unwrapFanbridge } from './fanbridge.js'

describe('unwrapFanbridge', () => {
  it('should extract the target from a click link', () => {
    const url = new URL(
      'http://clicks.fanbridge.com/l.php?cid=1461265&sid=221380982&url=https%3A%2F%2Fexample.com%2Fband',
    )

    expect(unwrapFanbridge(url)).toBe('https://example.com/band')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://clicks.fanbridge.com/l.php?cid=1563006&sid=198884464&url=https%253A%252F%252Fexample.com%252Fband%253Fref%253Dmail',
    )

    expect(unwrapFanbridge(url)).toBe('https://example.com/band?ref=mail')
  })

  it('should return undefined when url is missing', () => {
    const url = new URL('https://clicks.fanbridge.com/l.php?cid=1461265&sid=221380982')

    expect(unwrapFanbridge(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://clicks.fanbridge.com/o.php?cid=1461265&url=https%3A%2F%2Fexample.com%2Fband',
    )

    expect(unwrapFanbridge(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/l.php?cid=1461265&url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapFanbridge(url)).toBeUndefined()
  })
})
