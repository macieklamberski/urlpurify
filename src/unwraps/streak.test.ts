import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapStreak } from './streak.js'

describe('unwrapStreak', () => {
  it('should give https to a bare host target', () => {
    const value = 'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/www.example.com'
    const expected = 'https://www.example.com/'

    expect(purifyUrl(value, { unwrappers: [unwrapStreak] })).toBe(expected)
  })

  it('should extract target on streaklinks.com', () => {
    const value = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should extract target on streak-link.com', () => {
    const value = new URL(
      'https://streak-link.com/Bb_HFFZmJjMguMPoOAUdvG9r/https%3A%2F%2Fexample.com%2Fcollections%2Fnew-in-2',
    )
    const expected = 'https://example.com/collections/new-in-2'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should extract target on a sender subdomain', () => {
    const value = new URL(
      'https://5e574909.streak-link.com/C8Q4NhlX1-pX1PUWWw-8HFLy/https%3A%2F%2Fwww.example.com%2Fresearch%2Fpolicy',
    )
    const expected = 'https://www.example.com/research/policy'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should decode a target encoded twice', () => {
    const value = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%253A%252F%252Fwww.example.com%252Fnews',
    )
    const expected = 'https://www.example.com/news'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should extract an http target', () => {
    const value = new URL(
      'https://0176ede8.streak-link.com/C6jpgKWtLcXpNMfWwA-YlnsU/http%3A%2F%2Fwww.example.com%2Fprofile',
    )
    const expected = 'http://www.example.com/profile'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2Fp%3Futm_source%3Dai-break%26utm_medium%3Demail%23top',
    )
    const expected = 'https://example.com/p?utm_source=ai-break&utm_medium=email#top'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should restore a percent sign the target had encoded', () => {
    const value = new URL(
      'https://streaklinks.com/BTvvpUIOjpB0MDrqkwsfNCbq/https%3A%2F%2Fexample.com%2Fpulse%2F%3FtrackingId%3Du5WCX%252BRpuOLPdrQof3moPw%253D%253D',
    )
    const expected = 'https://example.com/pulse/?trackingId=u5WCX%2BRpuOLPdrQof3moPw%3D%3D'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should ignore an email param appended after the target', () => {
    const value = new URL(
      'https://streaklinks.com/Bz1oEeudnYsHeJ_t7AVhyOF3/https%3A%2F%2Fexample.com?email=user%40example.org',
    )
    const expected = 'https://example.com'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should extract a target that is another wrapper', () => {
    const value = new URL(
      'https://16b39c80.streak-link.com/Cysa1bb6OpUxjiCfMgR_-B4i/https%3A%2F%2Fwww.example.com%2Furl%3Fq%3Dhttps%3A%2F%2Fexample.org%2F',
    )
    const expected = 'https://www.example.com/url?q=https://example.org/'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should return undefined for another path on the domain', () => {
    const value = new URL('https://streaklinks.com/about')

    expect(unwrapStreak(value)).toBeUndefined()
  })

  it('should return undefined for the root of the domain', () => {
    const value = new URL('https://streaklinks.com/')

    expect(unwrapStreak(value)).toBeUndefined()
  })

  it('should return undefined when the id is shorter than 24 characters', () => {
    const value = new URL('https://streaklinks.com/BtuZeQExcU8Zwbux/https%3A%2F%2Fexample.com%2F')

    expect(unwrapStreak(value)).toBeUndefined()
  })

  it('should return undefined when the id is longer than 24 characters', () => {
    const value = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLxx/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapStreak(value)).toBeUndefined()
  })

  it('should return undefined when the target is missing', () => {
    const value = new URL('https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/')

    expect(unwrapStreak(value)).toBeUndefined()
  })

  it('should return undefined when the target has literal slashes', () => {
    const value = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https://example.com/a/b',
    )

    expect(unwrapStreak(value)).toBeUndefined()
  })

  it('should return undefined when the path has a segment after the target', () => {
    const value = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F/extra',
    )

    expect(unwrapStreak(value)).toBeUndefined()
  })

  it('should return undefined when the path has a segment before the id', () => {
    const value = new URL(
      'https://streaklinks.com/x/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapStreak(value)).toBeUndefined()
  })

  it('should keep the wrapper for a target that is not http', () => {
    const value = 'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/mailto%3Auser%40example.com'

    expect(purifyUrl(value, { unwrappers: [unwrapStreak] })).toBe(value)
  })

  it('should keep a malformed escape in the target as written', () => {
    const value = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F%E0%A4%A',
    )
    const expected = 'https://example.com/%E0%A4%A'

    expect(unwrapStreak(value)).toBe(expected)
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL(
      'https://tracking.example.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapStreak(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends in the domain name', () => {
    const value = new URL(
      'https://examplestreaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapStreak(value)).toBeUndefined()
  })
})
