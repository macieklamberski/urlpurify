import { describe, expect, it } from 'bun:test'
import { unwrapOsnova } from './osnova.js'

describe('unwrapOsnova', () => {
  it('should extract the target from the vc.ru redirect', () => {
    const value = new URL(
      'https://api.vc.ru/v2.8/redirect?to=https%3A%2F%2Ft.me%2Fexample&postId=2357936',
    )
    const expected = 'https://t.me/example'

    expect(unwrapOsnova(value)).toBe(expected)
  })

  it('should extract the target from the dtf.ru redirect', () => {
    const value = new URL(
      'https://api.dtf.ru/v2.8/redirect?to=https%3A%2F%2Fstore.example.com%2Fapp%2F2129570%2F%3Fbeta%3D0&postId=5158797',
    )
    const expected = 'https://store.example.com/app/2129570/?beta=0'

    expect(unwrapOsnova(value)).toBe(expected)
  })

  it('should return undefined for the redirect without to', () => {
    const value = new URL('https://api.vc.ru/v2.8/redirect?postId=2357936')

    expect(unwrapOsnova(value)).toBeUndefined()
  })

  it('should return undefined for another route on the API host', () => {
    const value = new URL('https://api.vc.ru/v2.8/content?to=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapOsnova(value)).toBeUndefined()
  })

  it('should return undefined for the redirect route under another prefix', () => {
    const value = new URL(
      'https://api.vc.ru/proxy/v2.8/redirect?to=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapOsnova(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/v2.8/redirect?to=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapOsnova(value)).toBeUndefined()
  })
})
