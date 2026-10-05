import { describe, expect, it } from 'bun:test'
import { unwrapBale } from './bale.js'

describe('unwrapBale', () => {
  it('should extract target from l param', () => {
    const url = new URL(
      'https://l.ble.ir/?l=https%3A%2F%2Fwww.example.com%2F&spec=eyJzcCI6Ijk2OTc4OTU5MSIsImNwIjoiOTY5Nzg5NTkxIn0%3D',
    )

    expect(unwrapBale(url)).toBe('https://www.example.com/')
  })

  it('should extract target without the spec param', () => {
    const url = new URL('https://l.ble.ir/?l=http%3A%2F%2Fwww.example.com%2Fpost')

    expect(unwrapBale(url)).toBe('http://www.example.com/post')
  })

  it('should return undefined when l param is missing', () => {
    const url = new URL('https://l.ble.ir/?spec=eyJzcCI6Ijk2OTc4OTU5MSJ9')

    expect(unwrapBale(url)).toBeUndefined()
  })

  it('should return undefined when l param is empty', () => {
    const url = new URL('https://l.ble.ir/?l=')

    expect(unwrapBale(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://l.ble.ir/assets/?l=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapBale(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://l.example.com/?l=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapBale(url)).toBeUndefined()
  })
})
