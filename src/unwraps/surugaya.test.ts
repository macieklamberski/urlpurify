import { describe, expect, it } from 'bun:test'
import { unwrapSurugaya } from './surugaya.js'

describe('unwrapSurugaya', () => {
  it('should extract the target from the affiliate jump', () => {
    const value = new URL(
      'https://affiliate.suruga-ya.jp/modules/af/af_jump.php?user_id=4867&goods_url=https%3A%2F%2Fwww.example.jp%2Fproduct%2Fdetail%2F12401058',
    )
    const expected = 'https://www.example.jp/product/detail/12401058'

    expect(unwrapSurugaya(value)).toBe(expected)
  })

  it('should extract a target with only its scheme encoded', () => {
    const value = new URL(
      'https://affiliate.suruga-ya.jp/modules/af/af_jump.php?user_id=4867&goods_url=https%3A//www.example.jp/product/detail/12401058',
    )
    const expected = 'https://www.example.jp/product/detail/12401058'

    expect(unwrapSurugaya(value)).toBe(expected)
  })

  it('should return undefined for the affiliate jump without goods_url', () => {
    const value = new URL('https://affiliate.suruga-ya.jp/modules/af/af_jump.php?user_id=4867')

    expect(unwrapSurugaya(value)).toBeUndefined()
  })

  it('should return undefined for the affiliate banner', () => {
    const value = new URL(
      'https://affiliate.suruga-ya.jp/modules/af/af_banner.php?user_id=1&goods_url=https%3A%2F%2Fwww.example.jp%2F',
    )

    expect(unwrapSurugaya(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/modules/af/af_jump.php?goods_url=https%3A%2F%2Fwww.example.jp%2F',
    )

    expect(unwrapSurugaya(value)).toBeUndefined()
  })
})
