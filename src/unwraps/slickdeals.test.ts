import { describe, expect, it } from 'bun:test'
import { unwrapSlickdeals } from './slickdeals.js'

describe('unwrapSlickdeals', () => {
  it('should extract a plain target from u2 param', () => {
    const url = new URL(
      'http://slickdeals.net/?sdtid=2781041&sdfpid=48935&sdfid=9&u2=http://www.example.com/t5/Compilation-of-issues',
    )

    expect(unwrapSlickdeals(url)).toBe('http://www.example.com/t5/Compilation-of-issues')
  })

  it('should extract a percent-encoded target from u2 param', () => {
    const url = new URL(
      'https://slickdeals.net/?sdtid=17040913&sdfpid=884431&sdpid=167065501&sdfid=9&lno=1&u2=https%3A%2F%2Fwww.example.com%2FM66B%2FNetGuard%2Freleases',
    )

    expect(unwrapSlickdeals(url)).toBe('https://www.example.com/M66B/NetGuard/releases')
  })

  it('should return undefined when u2 param is missing', () => {
    const url = new URL('http://slickdeals.net/?sdtid=2781041&sdfid=9')

    expect(unwrapSlickdeals(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Slickdeals host', () => {
    const url = new URL('https://slickdeals.net/newsearch.php?u2=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapSlickdeals(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/?sdtid=2781041&u2=http://www.example.org/')

    expect(unwrapSlickdeals(url)).toBeUndefined()
  })
})
