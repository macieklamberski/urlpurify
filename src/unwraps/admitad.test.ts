import { describe, expect, it } from 'bun:test'
import { unwrapAdmitad } from './admitad.js'

describe('unwrapAdmitad', () => {
  it('should extract target from ulp param', () => {
    const url = new URL(
      'https://ad.admitad.com/g/26qh23putc505d70264a53b922955a/?subid=novosti&ulp=https%3A%2F%2Fwww.example.com%2Fcities%2Ftenerife%2F',
    )

    expect(unwrapAdmitad(url)).toBe('https://www.example.com/cities/tenerife/')
  })

  it('should extract target from ulp param on the goto path', () => {
    const url = new URL(
      'http://ad.admitad.com/goto/ba05bcc976d210f49e42bcaf79cd03/?ulp=http:%2F%2Fwww.example.com%2Fitem%2Fc092e6-kurtka-savage',
    )

    expect(unwrapAdmitad(url)).toBe('http://www.example.com/item/c092e6-kurtka-savage')
  })

  it('should extract target from ulp param on alitems.com', () => {
    const url = new URL(
      'https://alitems.com/g/9vijc7ptzd8e7c791e807a660ebfae/?ulp=https%3A%2F%2Fwww.example.com%2Fitem%2F1005002225432995.html',
    )

    expect(unwrapAdmitad(url)).toBe('https://www.example.com/item/1005002225432995.html')
  })

  it('should return undefined when ulp param is missing', () => {
    const url = new URL('https://ad.admitad.com/g/26qh23putc505d70264a53b922955a/?subid=novosti')

    expect(unwrapAdmitad(url)).toBeUndefined()
  })

  it('should return undefined for a click path under a prefix', () => {
    const url = new URL(
      'https://ad.admitad.com/x/g/26qh23putc505d70264a53b922955a/?ulp=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdmitad(url)).toBeUndefined()
  })

  it('should return undefined for a path below the click id', () => {
    const url = new URL(
      'https://ad.admitad.com/g/26qh23putc505d70264a53b922955a/extra?ulp=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdmitad(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://ad.admitad.com/fbanner/5371e02f8d3f6132207f38da8cfb49/?ulp=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAdmitad(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/g/26qh23putc505d70264a53b922955a/?ulp=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapAdmitad(url)).toBeUndefined()
  })
})
