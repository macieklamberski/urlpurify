import { describe, expect, it } from 'bun:test'
import { unwrapSmartredirect } from './smartredirect.js'

describe('unwrapSmartredirect', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://smartredirect.de/?url=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapSmartredirect(url)).toBe('https://example.com/product')
  })

  it('should extract target from the clickGate path', () => {
    const url = new URL(
      'http://www.smartredirect.de/redir/clickGate.php?u=AbCdEf&m=1&p=GhIjKl&t=MnOpQr&splash=0&url=https%3A%2F%2Fexample.com%2Flisting%2F1',
    )

    expect(unwrapSmartredirect(url)).toBe('https://example.com/listing/1')
  })

  it('should extract target from the api path', () => {
    const url = new URL(
      'https://api.smartredirect.de/api_v2/ClickGate.php?p=AbCdEf&k=0123&url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapSmartredirect(url)).toBe('https://example.com/post')
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL('https://go.smartredirect.de/?url=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapSmartredirect(url)).toBe('https://example.com/product')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://smartredirect.de/?other=value')

    expect(unwrapSmartredirect(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://www.smartredirect.de/about?url=https%3A%2F%2Fexample.com')

    expect(unwrapSmartredirect(url)).toBeUndefined()
  })

  it('should return undefined for a clickGate path with another letter case', () => {
    const url = new URL(
      'https://www.smartredirect.de/redir/ClickGate.php?url=https%3A%2F%2Fexample.com',
    )

    expect(unwrapSmartredirect(url)).toBeUndefined()
  })

  it('should return undefined for non-smartredirect hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapSmartredirect(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplesmartredirect.de/?url=https%3A%2F%2Fexample.com')

    expect(unwrapSmartredirect(url)).toBeUndefined()
  })
})
