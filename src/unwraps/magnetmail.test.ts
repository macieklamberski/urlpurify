import { describe, expect, it } from 'bun:test'
import { unwrapMagnetmail } from './magnetmail.js'

describe('unwrapMagnetmail', () => {
  it('should extract the target from a click link', () => {
    const url = new URL(
      'http://www.mmsend3.com/link.cfm?r=626898905&sid=10799691&m=1117090&u=Crescendo&s=http://example.com/products/einkorn-pasta',
    )

    expect(unwrapMagnetmail(url)).toBe('http://example.com/products/einkorn-pasta')
  })

  it('should keep the query of an unencoded target', () => {
    const url = new URL(
      'http://www.mmsend67.com/link.cfm?r=701497273&sid=24097339&m=2609744&u=IntReading&j=13929342&s=http://example.com/index.cfm?do=cnt.page',
    )

    expect(unwrapMagnetmail(url)).toBe('http://example.com/index.cfm?do=cnt.page')
  })

  it('should extract a percent-encoded target', () => {
    const url = new URL(
      'http://www.mmsend47.com/link.cfm?r=1183449075&sid=99865572&m=13228822&u=LIONSPROD&s=https%3A%2F%2Fexample.com%2Fnews%2F',
    )

    expect(unwrapMagnetmail(url)).toBe('https://example.com/news/')
  })

  it('should return undefined when s is missing', () => {
    const url = new URL('http://www.mmsend3.com/link.cfm?r=626898905&sid=10799691&m=1117090')

    expect(unwrapMagnetmail(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'http://www.mmsend2.com/ls.cfm?r=199253731&sid=6567830&m=734392&s=http://example.com/',
    )

    expect(unwrapMagnetmail(url)).toBeUndefined()
  })

  it('should return undefined for a host without the number', () => {
    const url = new URL('http://www.mmsend.com/link.cfm?r=626898905&s=http://example.com/')

    expect(unwrapMagnetmail(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a family host', () => {
    const url = new URL(
      'http://www.mmsend3.com.example.com/link.cfm?r=626898905&s=http://example.com/',
    )

    expect(unwrapMagnetmail(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with a family host', () => {
    const url = new URL('http://click.www.mmsend3.com/link.cfm?r=626898905&s=http://example.com/')

    expect(unwrapMagnetmail(url)).toBeUndefined()
  })
})
