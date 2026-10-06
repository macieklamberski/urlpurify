import { describe, expect, it } from 'bun:test'
import { unwrapVocus } from './vocus.js'

describe('unwrapVocus', () => {
  it('should extract target from the link path', () => {
    const url = new URL(
      'https://tracking.vocus.io/link?id=5e4c0eb3-5bec-4e0e-a2c2-c6cdda0e87af&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapVocus(url)).toBe('https://www.example.com/')
  })

  it('should extract target from the mlink path', () => {
    const url = new URL(
      'https://tracking.vocus.io/mlink?id=78b240a9-13ed-4cdf-9576-940d512e4558&url=https://www.example.com/watch?v=ko1gkRfX8ys',
    )

    expect(unwrapVocus(url)).toBe('https://www.example.com/watch?v=ko1gkRfX8ys')
  })

  it('should keep the fragment of an unencoded target', () => {
    const url = new URL(
      'https://tracking.vocus.io/mlink?id=78b240a9-13ed-4cdf-9576-940d512e4558&url=https://www.example.com/fact-sheets/detail/air-pollution#:~:text=3.8%20million%20people',
    )

    expect(unwrapVocus(url)).toBe(
      'https://www.example.com/fact-sheets/detail/air-pollution#:~:text=3.8%20million%20people',
    )
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://tracking.vocus.io/link?id=d5bc2b7c-12a5-4ea6-acec-59b6d5d35657&url=https%253A%252F%252Fwww.example.com%252Flifestyle-vs-lifespan%252F',
    )

    expect(unwrapVocus(url)).toBe('https://www.example.com/lifestyle-vs-lifespan/')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://tracking.vocus.io/link?id=5e4c0eb3-5bec-4e0e-a2c2-c6cdda0e87af')

    expect(unwrapVocus(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('https://tracking.vocus.io/open?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapVocus(url)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const url = new URL(
      'https://tracking.example.com/link?id=5e4c0eb3-5bec-4e0e-a2c2-c6cdda0e87af&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapVocus(url)).toBeUndefined()
  })
})
