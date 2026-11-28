import { describe, expect, it } from 'bun:test'
import { unwrapLivejournal } from './livejournal.js'

describe('unwrapLivejournal', () => {
  it('should extract target from to param', () => {
    const value = new URL(
      'https://www.livejournal.com/away?to=https%3A%2F%2Fwww.example.com%2Fdentist-seo-marketing%2F',
    )
    const expected = 'https://www.example.com/dentist-seo-marketing/'

    expect(unwrapLivejournal(value)).toBe(expected)
  })

  it('should extract a target that is another wrapper', () => {
    const value = new URL(
      'https://www.livejournal.com/away?to=https%3A%2F%2Fdzen.ru%2Faway%3Fto%3Dhttps%253A%252F%252Fwww.example.com%252F',
    )
    const expected = 'https://dzen.ru/away?to=https%3A%2F%2Fwww.example.com%2F'

    expect(unwrapLivejournal(value)).toBe(expected)
  })

  it('should return undefined for the post intent', () => {
    const value = new URL('https://www.livejournal.com/update.bml?event=https://www.example.com')

    expect(unwrapLivejournal(value)).toBeUndefined()
  })

  it('should return undefined for the login return url', () => {
    const value = new URL(
      'https://www.livejournal.com/login.bml?returnto=http%3A%2F%2Fwww.livejournal.com%2Fupdate.bml',
    )

    expect(unwrapLivejournal(value)).toBeUndefined()
  })

  it('should return undefined for the to param on another path', () => {
    const value = new URL(
      'https://www.livejournal.com/login.bml?to=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLivejournal(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL('https://www.example.com/away?to=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapLivejournal(value)).toBeUndefined()
  })

  it('should return undefined when to param is missing', () => {
    const value = new URL('https://www.livejournal.com/away')

    expect(unwrapLivejournal(value)).toBeUndefined()
  })
})
