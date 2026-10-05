import { describe, expect, it } from 'bun:test'
import { unwrapGlueUp } from './glueUp.js'

describe('unwrapGlueUp', () => {
  it('should extract target from redirect_url param', () => {
    const url = new URL(
      'https://satsa.glueup.com/track/rd?type=campaign&lid=1&tracking_id=2430:520142:6990f331-e381-47f8-8485-01be473fdb63&redirect_url=https%3A%2F%2Fexample.travel%2Fgallery%2F&ts=1784796402&ps=cGFxNDFBd1RIRGdCNmxyR3pWY09CbjdrTUhGSnhBVDk2M',
    )

    expect(unwrapGlueUp(url)).toBe('https://example.travel/gallery/')
  })

  it('should return undefined when redirect_url param is missing', () => {
    const url = new URL(
      'https://satsa.glueup.com/track/rd?type=campaign&lid=1&tracking_id=2430:520142:6990f331-e381-47f8-8485-01be473fdb63',
    )

    expect(unwrapGlueUp(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://satsa.glueup.com/event/financing-space?redirect_url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapGlueUp(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('https://example.com/track/rd?redirect_url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapGlueUp(url)).toBeUndefined()
  })
})
