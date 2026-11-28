import { describe, expect, it } from 'bun:test'
import { unwrapBale } from './bale.js'

describe('unwrapBale', () => {
  it('should extract target from l param', () => {
    const value = new URL(
      'https://l.ble.ir/?l=https%3A%2F%2Fwww.example.com%2F&spec=eyJzcCI6Ijk2OTc4OTU5MSIsImNwIjoiOTY5Nzg5NTkxIn0%3D',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapBale(value)).toBe(expected)
  })

  it('should extract target without the spec param', () => {
    const value = new URL('https://l.ble.ir/?l=http%3A%2F%2Fwww.example.com%2Fpost')
    const expected = 'http://www.example.com/post'

    expect(unwrapBale(value)).toBe(expected)
  })

  it('should return undefined when l param is missing', () => {
    const value = new URL('https://l.ble.ir/?spec=eyJzcCI6Ijk2OTc4OTU5MSJ9')

    expect(unwrapBale(value)).toBeUndefined()
  })

  it('should return undefined when l param is empty', () => {
    const value = new URL('https://l.ble.ir/?l=')

    expect(unwrapBale(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://l.ble.ir/assets/?l=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapBale(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL('https://l.example.com/?l=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapBale(value)).toBeUndefined()
  })
})
