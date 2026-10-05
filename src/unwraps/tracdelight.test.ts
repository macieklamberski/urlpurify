import { describe, expect, it } from 'bun:test'
import { unwrapTracdelight } from './tracdelight.js'

describe('unwrapTracdelight', () => {
  it('should extract target from link param', () => {
    const url = new URL(
      'http://td.oo34.net/cl/?tt=slg&aaid=og2kfajvmo9eahzf&paid=xyr6hozw8cguchec&link=https://www.example.com/faithfull-delia-midikleid/prd/6117980',
    )

    expect(unwrapTracdelight(url)).toBe(
      'https://www.example.com/faithfull-delia-midikleid/prd/6117980',
    )
  })

  it('should extract target from link in the path when the query mark is missing', () => {
    const url = new URL(
      'http://td.oo34.net/cl/aaid=16u3v1y8knd838s8&paid=77ceny1xgz2g9gha&link=http://www.example.com/anthro/index.jsp?cat=1',
    )

    expect(unwrapTracdelight(url)).toBe('http://www.example.com/anthro/index.jsp?cat=1')
  })

  it('should return undefined when link param is missing', () => {
    const url = new URL('http://td.oo34.net/cl/?tt=slg&aaid=og2kfajvmo9eahzf&paid=xyr6hozw8cguchec')

    expect(unwrapTracdelight(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracking host', () => {
    const url = new URL(
      'http://td.oo34.net/im/?tt=slg&aaid=og2kfajvmo9eahzf&link=https://www.example.com/',
    )

    expect(unwrapTracdelight(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'http://example.com/cl/?tt=slg&aaid=og2kfajvmo9eahzf&link=https://www.example.org/',
    )

    expect(unwrapTracdelight(url)).toBeUndefined()
  })

  it('should return undefined for the path shape on other hosts', () => {
    const url = new URL(
      'http://example.com/cl/aaid=16u3v1y8knd838s8&paid=77ceny1xgz2g9gha&link=http://www.example.org/',
    )

    expect(unwrapTracdelight(url)).toBeUndefined()
  })
})
