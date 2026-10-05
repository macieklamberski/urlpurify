import { describe, expect, it } from 'bun:test'
import { unwrapSmore } from './smore.js'

describe('unwrapSmore', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'http://www.smore.com/app/reporting/out/wjgj?u=http%3A%2F%2Fexample.coop%2F&t=Animation&w=w-2195415536&i=&l=l-6674852852',
    )

    expect(unwrapSmore(url)).toBe('http://example.coop/')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://www.smore.com/app/reporting/out/a45n?u=http%253A%252F%252Fwww.example.com%252F&t=Keira&w=w-8456607883',
    )

    expect(unwrapSmore(url)).toBe('http://www.example.com/')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://www.smore.com/app/reporting/out/a45n?t=Keira&w=w-8456607883')

    expect(unwrapSmore(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('https://www.smore.com/64ue3-sept-10?u=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapSmore(url)).toBeUndefined()
  })

  it('should return undefined for a path below a link', () => {
    const url = new URL(
      'https://www.smore.com/app/reporting/out/a45n/extra?u=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapSmore(url)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const url = new URL(
      'https://www.smore.com/x/app/reporting/out/a45n?u=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapSmore(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('https://example.com/app/reporting/out/a45n?u=http%3A%2F%2Fexample.org%2F')

    expect(unwrapSmore(url)).toBeUndefined()
  })
})
