import { describe, expect, it } from 'bun:test'
import { unwrapXinhuaBig5 } from './xinhuaBig5.js'

describe('unwrapXinhuaBig5', () => {
  it('should extract a target with its scheme dropped', () => {
    const url = new URL(
      'http://big5.xinhuanet.com/gate/big5/www.example.com/index/gdbb/201009/846525.htm',
    )

    expect(unwrapXinhuaBig5(url)).toBe('http://www.example.com/index/gdbb/201009/846525.htm')
  })

  it('should extract a target host with no path', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/big5/www.example.com/')

    expect(unwrapXinhuaBig5(url)).toBe('http://www.example.com/')
  })

  it('should keep the query and fragment of a target', () => {
    const url = new URL(
      'http://big5.xinhuanet.com/gate/big5/news.example.com/english/china/2012-12/26/c_132065522.htm?ref=example.org#top',
    )

    expect(unwrapXinhuaBig5(url)).toBe(
      'http://news.example.com/english/china/2012-12/26/c_132065522.htm?ref=example.org#top',
    )
  })

  it('should return undefined for the bare gate path', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/big5/')

    expect(unwrapXinhuaBig5(url)).toBeUndefined()
  })

  it('should return undefined for a segment that is not a host', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/big5/index/2010/846525.htm')

    expect(unwrapXinhuaBig5(url)).toBeUndefined()
  })

  it('should return undefined for a target host that does not parse', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/big5/www.example.com%2/index.htm')

    expect(unwrapXinhuaBig5(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/gb/www.example.com/index.htm')

    expect(unwrapXinhuaBig5(url)).toBeUndefined()
  })

  it('should return undefined for the gate path below another path', () => {
    const url = new URL('http://big5.xinhuanet.com/news/gate/big5/www.example.com/index.htm')

    expect(unwrapXinhuaBig5(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/gate/big5/www.example.org/index.htm')

    expect(unwrapXinhuaBig5(url)).toBeUndefined()
  })
})
