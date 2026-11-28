import { describe, expect, it } from 'bun:test'
import { unwrapSmartredirect } from './smartredirect.js'

describe('unwrapSmartredirect', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://smartredirect.de/?url=https%3A%2F%2Fexample.com%2Fproduct')
    const expected = 'https://example.com/product'

    expect(unwrapSmartredirect(value)).toBe(expected)
  })

  it('should extract target from the clickGate path', () => {
    const value = new URL(
      'http://www.smartredirect.de/redir/clickGate.php?u=AbCdEf&m=1&p=GhIjKl&t=MnOpQr&splash=0&url=https%3A%2F%2Fexample.com%2Flisting%2F1',
    )
    const expected = 'https://example.com/listing/1'

    expect(unwrapSmartredirect(value)).toBe(expected)
  })

  it('should extract target from the api path', () => {
    const value = new URL(
      'https://api.smartredirect.de/api_v2/ClickGate.php?p=AbCdEf&k=0123&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapSmartredirect(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://smartredirect.de/?other=value')

    expect(unwrapSmartredirect(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://www.smartredirect.de/about?url=https%3A%2F%2Fexample.com')

    expect(unwrapSmartredirect(value)).toBeUndefined()
  })

  it('should match a clickGate path in another letter case', () => {
    const value = new URL(
      'https://www.smartredirect.de/redir/ClickGate.php?url=https%3A%2F%2Fexample.com',
    )
    const expected = 'https://example.com'

    expect(unwrapSmartredirect(value)).toBe(expected)
  })

  it('should return undefined for non-smartredirect hosts', () => {
    const value = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapSmartredirect(value)).toBeUndefined()
  })
})
