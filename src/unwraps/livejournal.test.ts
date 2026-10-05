import { describe, expect, it } from 'bun:test'
import { unwrapLivejournal } from './livejournal.js'

describe('unwrapLivejournal', () => {
  it('should extract target from to param', () => {
    const url = new URL(
      'https://www.livejournal.com/away?to=https%3A%2F%2Fwww.example.com%2Fdentist-seo-marketing%2F',
    )

    expect(unwrapLivejournal(url)).toBe('https://www.example.com/dentist-seo-marketing/')
  })

  it('should extract a target that is another wrapper', () => {
    const url = new URL(
      'https://www.livejournal.com/away?to=https%3A%2F%2Fdzen.ru%2Faway%3Fto%3Dhttps%253A%252F%252Fwww.example.com%252F',
    )

    expect(unwrapLivejournal(url)).toBe('https://dzen.ru/away?to=https%3A%2F%2Fwww.example.com%2F')
  })

  it('should return undefined for the post intent', () => {
    const url = new URL('https://www.livejournal.com/update.bml?event=https://www.example.com')

    expect(unwrapLivejournal(url)).toBeUndefined()
  })

  it('should return undefined for the login return url', () => {
    const url = new URL(
      'https://www.livejournal.com/login.bml?returnto=http%3A%2F%2Fwww.livejournal.com%2Fupdate.bml',
    )

    expect(unwrapLivejournal(url)).toBeUndefined()
  })

  it('should return undefined for the to param on another path', () => {
    const url = new URL('https://www.livejournal.com/login.bml?to=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLivejournal(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('https://www.example.com/away?to=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapLivejournal(url)).toBeUndefined()
  })

  it('should return undefined when to param is missing', () => {
    const url = new URL('https://www.livejournal.com/away')

    expect(unwrapLivejournal(url)).toBeUndefined()
  })
})
