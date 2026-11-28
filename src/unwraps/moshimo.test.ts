import { describe, expect, it } from 'bun:test'
import { unwrapMoshimo } from './moshimo.js'

describe('unwrapMoshimo', () => {
  it('should extract target from url param on af.moshimo.com', () => {
    const value = new URL(
      'https://af.moshimo.com/af/c/click?a_id=3617781&p_id=54&pc_id=54&pl_id=616&url=https%3A%2F%2Fexample.com%2Fchanet%2F167080%2F',
    )
    const expected = 'https://example.com/chanet/167080/'

    expect(unwrapMoshimo(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://af.moshimo.com/af/c/click?a_id=992881&p_id=1225&pc_id=1925&pl_id=18502&url=https%3A%2F%2Fexample.com%2Fsearch%3Fp%3DTOEIC%26grp%3Dproduct',
    )
    const expected = 'https://example.com/search?p=TOEIC&grp=product'

    expect(unwrapMoshimo(value)).toBe(expected)
  })

  it('should prefer url over the mobile m param', () => {
    const value = new URL(
      'https://af.moshimo.com/af/c/click?a_id=1511546&p_id=54&pc_id=54&pl_id=616&url=https%3A%2F%2Fexample.com%2Fbook%2F15780521%2F&m=http%3A%2F%2Fm.example.com%2Fbook%2Fi%2F19462879%2F',
    )
    const expected = 'https://example.com/book/15780521/'

    expect(unwrapMoshimo(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://af.moshimo.com/af/c/click?a_id=770718&p_id=170&pc_id=185&pl_id=4062&url=http://example.com/dp/1429600950',
    )
    const expected = 'http://example.com/dp/1429600950'

    expect(unwrapMoshimo(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL(
      'https://af.moshimo.com/af/c/click?a_id=3617781&p_id=54&pc_id=54&pl_id=616',
    )

    expect(unwrapMoshimo(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('https://af.moshimo.com/af/c/click?a_id=3617781&url=')

    expect(unwrapMoshimo(value)).toBeUndefined()
  })

  it('should return undefined for the assignment path', () => {
    const value = new URL(
      'http://c.af.moshimo.com/af/c/assignment/external?a_id=11977&p_id=54&pc_id=54&pl_id=616&url=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapMoshimo(value)).toBeUndefined()
  })
})
