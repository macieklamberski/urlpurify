import { describe, expect, it } from 'bun:test'
import { unwrapVirgool } from './virgool.js'

describe('unwrapVirgool', () => {
  it('should extract the target from the outbound redirect', () => {
    const url = new URL(
      'https://l.vrgl.ir/r?l=https%3A%2F%2Fwww.example.ir%2FTxEN2&u=qd25tsy6c1dh&st=post&si=uzhwju6mgzks&k=zQ6VCyznhNVwcd7UvDAaLnGdjTbaZRJqDnr9XgvpL5U%3D',
    )

    expect(unwrapVirgool(url)).toBe('https://www.example.ir/TxEN2')
  })

  it('should return undefined for the redirect without l', () => {
    const url = new URL('https://l.vrgl.ir/r?u=qd25tsy6c1dh&st=post&si=uzhwju6mgzks')

    expect(unwrapVirgool(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://l.vrgl.ir/?l=https%3A%2F%2Fwww.example.ir%2F')

    expect(unwrapVirgool(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/r?l=https%3A%2F%2Fwww.example.ir%2F')

    expect(unwrapVirgool(url)).toBeUndefined()
  })
})
