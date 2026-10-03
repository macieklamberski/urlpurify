import { describe, expect, it } from 'bun:test'
import { unwrapStreak } from './streak.js'

describe('unwrapStreak', () => {
  it('should extract target on streaklinks.com', () => {
    const url = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapStreak(url)).toBe('https://www.example.com/')
  })

  it('should extract target on streak-link.com', () => {
    const url = new URL(
      'https://streak-link.com/Bb_HFFZmJjMguMPoOAUdvG9r/https%3A%2F%2Fexample.com%2Fcollections%2Fnew-in-2',
    )

    expect(unwrapStreak(url)).toBe('https://example.com/collections/new-in-2')
  })

  it('should extract target on a sender subdomain', () => {
    const url = new URL(
      'https://5e574909.streak-link.com/C8Q4NhlX1-pX1PUWWw-8HFLy/https%3A%2F%2Fwww.example.com%2Fresearch%2Fpolicy',
    )

    expect(unwrapStreak(url)).toBe('https://www.example.com/research/policy')
  })

  it('should extract an http target', () => {
    const url = new URL(
      'https://0176ede8.streak-link.com/C6jpgKWtLcXpNMfWwA-YlnsU/http%3A%2F%2Fwww.example.com%2Fprofile',
    )

    expect(unwrapStreak(url)).toBe('http://www.example.com/profile')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2Fp%3Futm_source%3Dai-break%26utm_medium%3Demail%23top',
    )

    expect(unwrapStreak(url)).toBe('https://example.com/p?utm_source=ai-break&utm_medium=email#top')
  })

  it('should restore a percent sign the target had encoded', () => {
    const url = new URL(
      'https://streaklinks.com/BTvvpUIOjpB0MDrqkwsfNCbq/https%3A%2F%2Fexample.com%2Fpulse%2F%3FtrackingId%3Du5WCX%252BRpuOLPdrQof3moPw%253D%253D',
    )

    expect(unwrapStreak(url)).toBe(
      'https://example.com/pulse/?trackingId=u5WCX%2BRpuOLPdrQof3moPw%3D%3D',
    )
  })

  it('should ignore an email param appended after the target', () => {
    const url = new URL(
      'https://streaklinks.com/Bz1oEeudnYsHeJ_t7AVhyOF3/https%3A%2F%2Fexample.com?email=user%40example.org',
    )

    expect(unwrapStreak(url)).toBe('https://example.com')
  })

  it('should extract a target that is another wrapper', () => {
    const url = new URL(
      'https://16b39c80.streak-link.com/Cysa1bb6OpUxjiCfMgR_-B4i/https%3A%2F%2Fwww.example.com%2Furl%3Fq%3Dhttps%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapStreak(url)).toBe('https://www.example.com/url?q=https://example.org/')
  })

  it('should return undefined for another path on the domain', () => {
    const url = new URL('https://streaklinks.com/about')

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined for the root of the domain', () => {
    const url = new URL('https://streaklinks.com/')

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined when the id is shorter than 24 characters', () => {
    const url = new URL('https://streaklinks.com/BtuZeQExcU8Zwbux/https%3A%2F%2Fexample.com%2F')

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined when the id is longer than 24 characters', () => {
    const url = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLxx/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined when the target is missing', () => {
    const url = new URL('https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/')

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined when the target has literal slashes', () => {
    const url = new URL('https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https://example.com/a/b')

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined when the path has a segment after the target', () => {
    const url = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F/extra',
    )

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined when the path has a segment before the id', () => {
    const url = new URL(
      'https://streaklinks.com/x/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const url = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/mailto%3Auser%40example.com',
    )

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined for a malformed percent escape in the target', () => {
    const url = new URL(
      'https://streaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F%E0%A4%A',
    )

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL(
      'https://tracking.example.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapStreak(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends in the domain name', () => {
    const url = new URL(
      'https://examplestreaklinks.com/BtuZeQExcU8ZwbuxOgI9VdLx/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapStreak(url)).toBeUndefined()
  })
})
