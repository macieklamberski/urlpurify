import { describe, expect, it } from 'bun:test'
import { unwrapMoshimo } from './moshimo.js'

describe('unwrapMoshimo', () => {
  it('should extract target from url param on af.moshimo.com', () => {
    const url = new URL(
      'https://af.moshimo.com/af/c/click?a_id=3617781&p_id=54&pc_id=54&pl_id=616&url=https%3A%2F%2Fexample.com%2Fchanet%2F167080%2F',
    )

    expect(unwrapMoshimo(url)).toBe('https://example.com/chanet/167080/')
  })

  it('should extract target from url param on c.af.moshimo.com', () => {
    const url = new URL(
      'http://c.af.moshimo.com/af/c/click?a_id=224399&p_id=56&pc_id=56&pl_id=637&s_v=b5Rz2P0601xu&url=http%3A%2F%2Fexample.com%2Frb%2F12937554%2F',
    )

    expect(unwrapMoshimo(url)).toBe('http://example.com/rb/12937554/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://af.moshimo.com/af/c/click?a_id=992881&p_id=1225&pc_id=1925&pl_id=18502&url=https%3A%2F%2Fexample.com%2Fsearch%3Fp%3DTOEIC%26grp%3Dproduct',
    )

    expect(unwrapMoshimo(url)).toBe('https://example.com/search?p=TOEIC&grp=product')
  })

  it('should prefer url over the mobile m param', () => {
    const url = new URL(
      'https://af.moshimo.com/af/c/click?a_id=1511546&p_id=54&pc_id=54&pl_id=616&url=https%3A%2F%2Fexample.com%2Fbook%2F15780521%2F&m=http%3A%2F%2Fm.example.com%2Fbook%2Fi%2F19462879%2F',
    )

    expect(unwrapMoshimo(url)).toBe('https://example.com/book/15780521/')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://af.moshimo.com/af/c/click?a_id=770718&p_id=170&pc_id=185&pl_id=4062&url=http://example.com/dp/1429600950',
    )

    expect(unwrapMoshimo(url)).toBe('http://example.com/dp/1429600950')
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL(
      'https://www.moshimo.com/af/c/click?a_id=1&p_id=54&pc_id=54&pl_id=616&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapMoshimo(url)).toBe('https://example.com/')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://af.moshimo.com/af/c/click?a_id=3617781&p_id=54&pc_id=54&pl_id=616')

    expect(unwrapMoshimo(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://af.moshimo.com/af/c/click?a_id=3617781&url=')

    expect(unwrapMoshimo(url)).toBeUndefined()
  })

  it('should return undefined for the assignment path', () => {
    const url = new URL(
      'http://c.af.moshimo.com/af/c/assignment/external?a_id=11977&p_id=54&pc_id=54&pl_id=616&url=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapMoshimo(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://af.notmoshimo.com/af/c/click?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapMoshimo(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains moshimo.com', () => {
    const url = new URL(
      'https://af.moshimo.com.example.org/af/c/click?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapMoshimo(url)).toBeUndefined()
  })

  it('should extract target on the bare domain', () => {
    const url = new URL(
      'https://moshimo.com/af/c/click?a_id=1&p_id=54&pc_id=54&pl_id=616&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapMoshimo(url)).toBe('https://example.com/')
  })
})
