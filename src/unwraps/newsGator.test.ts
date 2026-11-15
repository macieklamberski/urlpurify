import { describe, expect, it } from 'bun:test'
import { unwrapNewsGator } from './newsGator.js'

describe('unwrapNewsGator', () => {
  describe('subext.aspx', () => {
    it('should extract a percent-encoded feed', () => {
      const value = new URL(
        'http://www.newsgator.com/ngs/subscriber/subext.aspx?url=http%3A%2F%2Ffeeds.example.com%2Fjoshlam',
      )
      const expected = 'http://feeds.example.com/joshlam'

      expect(unwrapNewsGator(value)).toBe(expected)
    })

    it('should extract a raw feed', () => {
      const value = new URL(
        'http://www.newsgator.com/ngs/subscriber/subext.aspx?url=http://feeds2.example.com/blogspot/WyNa',
      )
      const expected = 'http://feeds2.example.com/blogspot/WyNa'

      expect(unwrapNewsGator(value)).toBe(expected)
    })

    it('should decode a twice-encoded feed', () => {
      const value = new URL(
        'http://www.newsgator.com/ngs/subscriber/subext.aspx?url=http%253A%252F%252Fexample.com%252Ffeed',
      )
      const expected = 'http://example.com/feed'

      expect(unwrapNewsGator(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL(
        'http://www.newsgator.com/ngs/subscriber/SubExt.aspx?url=http%3A%2F%2Fexample.com%2Ffeed',
      )
      const expected = 'http://example.com/feed'

      expect(unwrapNewsGator(value)).toBe(expected)
    })

    it('should return undefined for an empty url', () => {
      const value = new URL('http://www.newsgator.com/ngs/subscriber/subext.aspx?url=')

      expect(unwrapNewsGator(value)).toBeUndefined()
    })

    it('should return undefined without a url', () => {
      const value = new URL('http://www.newsgator.com/ngs/subscriber/subext.aspx')

      expect(unwrapNewsGator(value)).toBeUndefined()
    })
  })

  describe('subfext.aspx', () => {
    it('should extract a percent-encoded feed', () => {
      const value = new URL(
        'http://www.newsgator.com/ngs/subscriber/subfext.aspx?url=http%3A%2F%2Fpipes.example.com%2Fpipes%2Fpipe.run%3F_id%3D3843bc59549eb622035e3f5d62b63ac7%26_render%3Drss',
      )
      const expected =
        'http://pipes.example.com/pipes/pipe.run?_id=3843bc59549eb622035e3f5d62b63ac7&_render=rss'

      expect(unwrapNewsGator(value)).toBe(expected)
    })
  })

  describe('controls', () => {
    it('should return undefined for another path', () => {
      const value = new URL(
        'http://www.newsgator.com/ngs/subscriber/subext.aspx/extra?url=http%3A%2F%2Fexample.com%2Ffeed',
      )

      expect(unwrapNewsGator(value)).toBeUndefined()
    })

    it('should return undefined for the shape on another host', () => {
      const value = new URL(
        'http://www.example.com/ngs/subscriber/subext.aspx?url=http%3A%2F%2Fexample.com%2Ffeed',
      )

      expect(unwrapNewsGator(value)).toBeUndefined()
    })

    it('should return undefined for the subfext shape on another host', () => {
      const value = new URL(
        'http://www.example.com/ngs/subscriber/subfext.aspx?url=http%3A%2F%2Fexample.com%2Ffeed',
      )

      expect(unwrapNewsGator(value)).toBeUndefined()
    })
  })
})
