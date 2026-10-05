import { describe, expect, it } from 'bun:test'
import { unwrapOo34 } from './oo34.js'

describe('unwrapOo34', () => {
  it('should extract target from link param', () => {
    const url = new URL(
      'http://td.oo34.net/cl/?tt=slg&aaid=og2kfajvmo9eahzf&paid=xyr6hozw8cguchec&link=https://www.example.com/faithfull-delia-midikleid/prd/6117980',
    )

    expect(unwrapOo34(url)).toBe('https://www.example.com/faithfull-delia-midikleid/prd/6117980')
  })

  it('should return undefined when link param is missing', () => {
    const url = new URL('http://td.oo34.net/cl/?tt=slg&aaid=og2kfajvmo9eahzf&paid=xyr6hozw8cguchec')

    expect(unwrapOo34(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the oo34.net host', () => {
    const url = new URL(
      'http://td.oo34.net/im/?tt=slg&aaid=og2kfajvmo9eahzf&link=https://www.example.com/',
    )

    expect(unwrapOo34(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'http://example.com/cl/?tt=slg&aaid=og2kfajvmo9eahzf&link=https://www.example.org/',
    )

    expect(unwrapOo34(url)).toBeUndefined()
  })
})
