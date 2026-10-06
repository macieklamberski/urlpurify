import { describe, expect, it } from 'bun:test'
import { unwrapRojadirecta } from './rojadirecta.js'

describe('unwrapRojadirecta', () => {
  it('should extract a target without a scheme', () => {
    const url = new URL('http://www.rojadirecta.me/goto/example.blogspot.com/p/canal10.html')

    expect(unwrapRojadirecta(url)).toBe('https://example.blogspot.com/p/canal10.html')
  })

  it('should keep the scheme of a target', () => {
    const url = new URL('http://www.rojadirecta.me/goto/http://example.com/canal-1.php')

    expect(unwrapRojadirecta(url)).toBe('http://example.com/canal-1.php')
  })

  it('should keep the query string of a target', () => {
    const url = new URL('http://www.rojadirecta.me/goto/example.com/channel.php?id=2')

    expect(unwrapRojadirecta(url)).toBe('https://example.com/channel.php?id=2')
  })

  it('should return undefined when the target is missing', () => {
    const url = new URL('http://www.rojadirecta.me/goto/')

    expect(unwrapRojadirecta(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('http://www.rojadirecta.me/es/example.com/')

    expect(unwrapRojadirecta(url)).toBeUndefined()
  })

  it('should return undefined for the same path on another host', () => {
    const url = new URL('http://www.example.com/goto/example.blogspot.com/')

    expect(unwrapRojadirecta(url)).toBeUndefined()
  })
})
