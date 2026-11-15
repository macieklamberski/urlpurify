import { describe, expect, it } from 'bun:test'
import { unwrapStumbleuponSubmit } from './stumbleuponSubmit.js'

describe('unwrapStumbleuponSubmit', () => {
  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'http://stumbleupon.com/submit?url=https%3A%2F%2Fwww.aalep.eu%2Fchina-not-yet-superpower&title=CHINA%2C%20NOT%20YET%20A%20SUPERPOWER',
    )
    const expected = 'https://www.aalep.eu/china-not-yet-superpower'

    expect(unwrapStumbleuponSubmit(value)).toBe(expected)
  })

  it('should extract a raw target on www.stumbleupon.com', () => {
    const value = new URL(
      'http://www.stumbleupon.com/submit?url=http://www.goodnewspdx.com/2011/02/18/whole-foods-making-a-micro-major-difference/&title=Whole+Foods+making+a+micro+%2',
    )
    const expected =
      'http://www.goodnewspdx.com/2011/02/18/whole-foods-making-a-micro-major-difference/'

    expect(unwrapStumbleuponSubmit(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://www.stumbleupon.com/submit?url=https%253A%252F%252Fwww.aalep.eu%252Fchina-not-yet-superpower',
    )
    const expected = 'https://www.aalep.eu/china-not-yet-superpower'

    expect(unwrapStumbleuponSubmit(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://www.stumbleupon.com/Submit?url=https%3A%2F%2Fwww.aalep.eu%2Fchina-not-yet-superpower',
    )
    const expected = 'https://www.aalep.eu/china-not-yet-superpower'

    expect(unwrapStumbleuponSubmit(value)).toBe(expected)
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('http://www.stumbleupon.com/submit?url=&title=Hello')

    expect(unwrapStumbleuponSubmit(value)).toBeUndefined()
  })

  it('should return undefined when only the title is set', () => {
    const value = new URL('http://www.stumbleupon.com/submit?title=https%3A%2F%2Fwww.aalep.eu%2F')

    expect(unwrapStumbleuponSubmit(value)).toBeUndefined()
  })

  it('should return undefined for the badge path', () => {
    const value = new URL(
      'http://www.stumbleupon.com/badge/embed/1/?url=https%3A%2F%2Fwww.aalep.eu%2Fchina-not-yet-superpower',
    )

    expect(unwrapStumbleuponSubmit(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'http://examplestumbleupon.com/submit?url=https%3A%2F%2Fwww.aalep.eu%2Fchina-not-yet-superpower',
    )

    expect(unwrapStumbleuponSubmit(value)).toBeUndefined()
  })
})
