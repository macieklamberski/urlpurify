import { describe, expect, it } from 'bun:test'
import { unwrapFlexoffers } from './flexoffers.js'

describe('unwrapFlexoffers', () => {
  it('should extract target from url param on g.ashx', () => {
    const url = new URL(
      'https://track.flexlinkspro.com/g.ashx?foid=1.13867&trid=1215225.619&foc=17&fot=9999&fos=6&url=https%3a%2f%2fwww.example.com%2fshop%2fkids%3fid%3d3866',
    )

    expect(unwrapFlexoffers(url)).toBe('https://www.example.com/shop/kids?id=3866')
  })

  it('should extract target from url param on a.ashx', () => {
    const url = new URL(
      'https://track.flexlinkspro.com/a.ashx?foid=1100654.32006574&foc=1&fot=9999&fos=1&url=http%3A%2F%2Fwww.example.com%2Fbutter-gloss%3FproductId%3D5050009',
    )

    expect(unwrapFlexoffers(url)).toBe('http://www.example.com/butter-gloss?productId=5050009')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://track.flexlinkspro.com/g.ashx?foid=1.13867&trid=1215225.619')

    expect(unwrapFlexoffers(url)).toBeUndefined()
  })

  it('should return undefined for the impression path', () => {
    const url = new URL(
      'https://track.flexlinkspro.com/i.ashx?foid=1&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapFlexoffers(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/g.ashx?foid=1&url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapFlexoffers(url)).toBeUndefined()
  })
})
