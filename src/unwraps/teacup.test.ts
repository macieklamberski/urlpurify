import { describe, expect, it } from 'bun:test'
import { unwrapTeacup } from './teacup.js'

describe('unwrapTeacup', () => {
  it('should extract the target from the board jump', () => {
    const url = new URL(
      'http://8252.teacup.com/jh4abz/bbs?M=JU&JUR=http%3A%2F%2Fwww.example.org%2FSG%2FNRSC-1-B.pdf',
    )

    expect(unwrapTeacup(url)).toBe('http://www.example.org/SG/NRSC-1-B.pdf')
  })

  it('should return undefined for another board action', () => {
    const url = new URL(
      'http://8252.teacup.com/jh4abz/bbs?M=RE&JUR=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapTeacup(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'http://8252.teacup.com/jh4abz/bbs/view?M=JU&JUR=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapTeacup(url)).toBeUndefined()
  })

  it('should return undefined for a host without a number', () => {
    const url = new URL('http://www.teacup.com/jh4abz/bbs?M=JU&JUR=http%3A%2F%2Fwww.example.org%2F')

    expect(unwrapTeacup(url)).toBeUndefined()
  })

  it('should return undefined for a host with a prefix before the number', () => {
    const url = new URL(
      'http://x8252.teacup.com/jh4abz/bbs?M=JU&JUR=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapTeacup(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the domain', () => {
    const url = new URL(
      'http://8252.teacup.com.example.com/jh4abz/bbs?M=JU&JUR=http%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapTeacup(url)).toBeUndefined()
  })
})
