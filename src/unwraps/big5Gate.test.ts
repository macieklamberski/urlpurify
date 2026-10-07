import { describe, expect, it } from 'bun:test'
import { unwrapBig5Gate } from './big5Gate.js'

describe('unwrapBig5Gate', () => {
  it('should extract a target with its scheme dropped', () => {
    const url = new URL(
      'http://big5.xinhuanet.com/gate/big5/www.example.com/index/gdbb/201009/846525.htm',
    )

    expect(unwrapBig5Gate(url)).toBe('http://www.example.com/index/gdbb/201009/846525.htm')
  })

  it('should extract a target from the gate on another host', () => {
    const url = new URL(
      'http://www.voafanti.com/gate/big5/www.example.com/chinese/news/20101216-Taiwan-111990559.html',
    )

    expect(unwrapBig5Gate(url)).toBe(
      'http://www.example.com/chinese/news/20101216-Taiwan-111990559.html',
    )
  })

  it('should extract a target host with no path', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/big5/www.example.com/')

    expect(unwrapBig5Gate(url)).toBe('http://www.example.com/')
  })

  it('should extract a target host with no trailing slash', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/big5/www.example.com')

    expect(unwrapBig5Gate(url)).toBe('http://www.example.com')
  })

  it('should keep the query and fragment of a target', () => {
    const url = new URL(
      'http://big5.xinhuanet.com/gate/big5/news.example.com/english/china/2012-12/26/c_132065522.htm?ref=example.org#top',
    )

    expect(unwrapBig5Gate(url)).toBe(
      'http://news.example.com/english/china/2012-12/26/c_132065522.htm?ref=example.org#top',
    )
  })

  it('should return undefined for the bare gate path', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/big5/')

    expect(unwrapBig5Gate(url)).toBeUndefined()
  })

  it('should return undefined for a segment that is not a host', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/big5/index/2010/846525.htm')

    expect(unwrapBig5Gate(url)).toBeUndefined()
  })

  it('should return undefined for a scheme pasted after a host prefix', () => {
    const url = new URL('https://big5.example.org/gate/big5/www.https://www.example.com/')

    expect(unwrapBig5Gate(url)).toBeUndefined()
  })

  it('should return undefined for a target host that does not parse', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/big5/www.example.999/index.htm')

    expect(unwrapBig5Gate(url)).toBeUndefined()
  })

  it('should return undefined for the gate of another charset', () => {
    const url = new URL('http://big5.xinhuanet.com/gate/gb/www.example.com/index.htm')

    expect(unwrapBig5Gate(url)).toBeUndefined()
  })

  it('should return undefined for the gate path below another path', () => {
    const url = new URL('http://www.example.org/news/gate/big5/www.example.com/index.htm')

    expect(unwrapBig5Gate(url)).toBeUndefined()
  })
})
