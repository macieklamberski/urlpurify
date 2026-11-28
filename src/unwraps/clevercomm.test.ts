import { describe, expect, it } from 'bun:test'
import { unwrapClevercomm } from './clevercomm.js'

describe('unwrapClevercomm', () => {
  it('should extract target from l param', () => {
    const value = new URL(
      'http://editor.clevercomm.com/y.z?l=https%3a%2f%2fwww.example.com%2fapp%2f606140%2f&j=327439854&e=12&p=2&t=h',
    )
    const expected = 'https://www.example.com/app/606140/'

    expect(unwrapClevercomm(value)).toBe(expected)
  })

  it('should return undefined when l param is missing', () => {
    const value = new URL('http://editor.clevercomm.com/y.z?j=327439854&e=12&p=2&t=h')

    expect(unwrapClevercomm(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL('http://editor.clevercomm.com/x.z?l=https%3a%2f%2fwww.example.com%2f')

    expect(unwrapClevercomm(value)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const value = new URL('http://editor.example.com/y.z?l=https%3a%2f%2fwww.example.com%2f')

    expect(unwrapClevercomm(value)).toBeUndefined()
  })
})
