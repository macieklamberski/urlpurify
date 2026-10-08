import { describe, expect, it } from 'bun:test'
import { unwrapRakutenAffiliate } from './rakutenAffiliate.js'

describe('unwrapRakutenAffiliate', () => {
  describe('hb.afl.rakuten.co.jp/hgc/ link', () => {
    it('should extract target from pc param', () => {
      const url = new URL(
        'https://hb.afl.rakuten.co.jp/hgc/16cd069d.07152461.16cd069e.8295d8f8/?pc=https%3A%2F%2Fexample.com%2Fshop%2Fitem%2F&link_type=text&ut=',
      )

      expect(unwrapRakutenAffiliate(url)).toBe('https://example.com/shop/item/')
    })

    it('should prefer pc over the mobile target in m', () => {
      const url = new URL(
        'https://hb.afl.rakuten.co.jp/hgc/16cd069d.07152461.16cd069e.8295d8f8/?pc=https%3A%2F%2Fexample.com%2Fshop%2Fitem%2F&m=https%3A%2F%2Fm.example.com%2Fshop%2Fitem%2F',
      )

      expect(unwrapRakutenAffiliate(url)).toBe('https://example.com/shop/item/')
    })

    it('should extract target when a link id follows the ids segment', () => {
      const url = new URL(
        'https://hb.afl.rakuten.co.jp/hgc/2855c4fb.d64e4925.2855c4fc.9164b834/tomareba_202511111344474227?pc=https%3A%2F%2Fexample.com%2Fhotel%2F',
      )

      expect(unwrapRakutenAffiliate(url)).toBe('https://example.com/hotel/')
    })

    it('should extract target when the ids segment is empty', () => {
      const url = new URL('http://hb.afl.rakuten.co.jp/hgc//?pc=http%3A%2F%2Fexample.com%2Fitem%2F')

      expect(unwrapRakutenAffiliate(url)).toBe('http://example.com/item/')
    })

    it('should return undefined when pc param is missing', () => {
      const url = new URL(
        'https://hb.afl.rakuten.co.jp/hgc/16cd069d.07152461.16cd069e.8295d8f8/?link_type=text',
      )

      expect(unwrapRakutenAffiliate(url)).toBeUndefined()
    })

    it('should return undefined when only the mobile target in m is present', () => {
      const url = new URL(
        'https://hb.afl.rakuten.co.jp/hgc/16cd069d.07152461.16cd069e.8295d8f8/?m=https%3A%2F%2Fm.example.com%2Fshop%2Fitem%2F',
      )

      expect(unwrapRakutenAffiliate(url)).toBeUndefined()
    })
  })

  describe('hb.afl.rakuten.co.jp/ichiba/ link', () => {
    it('should extract target from pc param', () => {
      const url = new URL(
        'https://hb.afl.rakuten.co.jp/ichiba/00000000.deb18cc6.00000000.deb18cc6/?pc=https%3A%2F%2Fexample.com%2Fshop%2Fitem%2F%3Fscid%3Daf_pc_bbtn&link_type=picttext',
      )

      expect(unwrapRakutenAffiliate(url)).toBe('https://example.com/shop/item/?scid=af_pc_bbtn')
    })
  })

  describe('pt.afl.rakuten.co.jp/c/ link', () => {
    it('should extract target from url param', () => {
      const url = new URL(
        'http://pt.afl.rakuten.co.jp/c/00008d94.89da87f5/?url=http%3a%2f%2fexample.com%2fsearch%2f&scid=af_ich_link_urltxt_pc',
      )

      expect(unwrapRakutenAffiliate(url)).toBe('http://example.com/search/')
    })
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://pt.afl.rakuten.co.jp/c/00008d94.89da87f5/?url=https://example.org/search/a+b&scid=af_ich_link_urltxt_pc',
    )

    expect(unwrapRakutenAffiliate(url)).toBe('https://example.org/search/a+b')
  })

  describe('mt.afl.rakuten.co.jp/mc/ link', () => {
    it('should extract target from url param', () => {
      const url = new URL(
        'http://mt.afl.rakuten.co.jp/mc/022d32cd.81666b9a/?url=http%3a%2f%2fexample.com%2fshop%2f',
      )

      expect(unwrapRakutenAffiliate(url)).toBe('http://example.com/shop/')
    })
  })

  describe('hbb.afl.rakuten.co.jp/hgb/ banner image', () => {
    it('should return undefined', () => {
      const url = new URL(
        'http://hbb.afl.rakuten.co.jp/hgb/003805c5.501d81e9.02af19e1.40f888a8/?me_id=1192258&item_id=10000589&m=https%3A%2F%2Fexample.com%2Fthumb.jpg%3F_ex%3D80x80&pc=https%3A%2F%2Fexample.com%2Fthumb.jpg%3F_ex%3D128x128&s=128x128',
      )

      expect(unwrapRakutenAffiliate(url)).toBeUndefined()
    })
  })

  describe('other paths and hosts', () => {
    it('should return undefined for the hsc shop link, which carries no target', () => {
      const url = new URL(
        'http://hb.afl.rakuten.co.jp/hsc/0bc1cd0c.89efab34.05494a04.c117ea21/?pc=https%3A%2F%2Fexample.com',
      )

      expect(unwrapRakutenAffiliate(url)).toBeUndefined()
    })

    it('should return undefined for the hgc path on a non-Rakuten host', () => {
      const url = new URL('https://example.com/hgc/16cd069d/?pc=https%3A%2F%2Fexample.org%2F')

      expect(unwrapRakutenAffiliate(url)).toBeUndefined()
    })
  })
})
