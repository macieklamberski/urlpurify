import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapLinksynergy } from './linksynergy.js'

describe('unwrapLinksynergy', () => {
  it('should repair a target the CMS spaced after its scheme', () => {
    const value =
      'https://click.linksynergy.com/deeplink?id=abc&mid=123&murl=http%3A%2F%2F+https%3A%2F%2Fwww.example.com%2Fzh-TW%2Factivity%2F20707'
    const expected = 'https://www.example.com/zh-TW/activity/20707'

    expect(purifyUrl(value, { unwrappers: [unwrapLinksynergy] })).toBe(expected)
  })

  describe('deeplink with murl', () => {
    it('should extract target from murl param', () => {
      const value = new URL(
        'https://click.linksynergy.com/deeplink?id=abc&mid=12345&murl=https%3A%2F%2Fexample.com%2Fproduct',
      )
      const expected = 'https://example.com/product'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })

    it('should keep a plus in an unencoded target', () => {
      const value = new URL(
        'https://click.linksynergy.com/deeplink?id=8ZOaQuHdH9M&mid=44583&murl=https://www.example.com/p/pl?d=Corsair+MP700+Pro+XT',
      )
      const expected = 'https://www.example.com/p/pl?d=Corsair+MP700+Pro+XT'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })

    it('should read the first copy of murl', () => {
      const value = new URL(
        'https://click.linksynergy.com/deeplink?id=abc&mid=12345&murl=https://www.example.com/a+b&murl=https://www.example.com/c',
      )
      const expected = 'https://www.example.com/a+b'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL(
        'https://click.linksynergy.com/DeepLink?id=abc&mid=12345&murl=https%3A%2F%2Fexample.com%2Fproduct',
      )
      const expected = 'https://example.com/product'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })

    it('should return undefined when murl param is missing', () => {
      const value = new URL('https://click.linksynergy.com/deeplink?id=abc&mid=12345')

      expect(unwrapLinksynergy(value)).toBeUndefined()
    })
  })

  describe('link with murl', () => {
    it('should extract target from murl param', () => {
      const value = new URL(
        'https://click.linksynergy.com/link?id=abc&murl=https%3A%2F%2Fexample.com%2Fproduct%2F10297&offerid=115554.10000488&type=3',
      )
      const expected = 'https://example.com/product/10297'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })
  })

  describe('fs-bin click with RD_PARM1', () => {
    it('should extract target encoded once', () => {
      const value = new URL(
        'http://click.linksynergy.com/fs-bin/click?id=abc&subid=&offerid=146261.1&type=10&tmpid=3909&RD_PARM1=http%3A%2F%2Fexample.com%2Fapp%2Fid492561899',
      )
      const expected = 'http://example.com/app/id492561899'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })

    it('should extract target encoded twice', () => {
      const value = new URL(
        'http://click.linksynergy.com/fs-bin/click?id=abc&subid=0&offerid=223073.1&type=10&tmpid=1082&RD_PARM1=https%253A%252F%252Fexample.com%252Fcp%252Fregistry%252F1229485',
      )
      const expected = 'https://example.com/cp/registry/1229485'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })

    it('should keep a stray percent sign in a twice-encoded target', () => {
      const value = new URL(
        'http://click.linksynergy.com/fs-bin/click?id=abc&offerid=223073.1&type=10&RD_PARM1=https%253A%252F%252Fexample.com%252F100%25',
      )
      const expected = 'https://example.com/100%'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })

    it('should not decode a target that is already an http url', () => {
      const value = new URL(
        'http://click.linksynergy.com/fs-bin/click?id=abc&offerid=146261.1&type=10&RD_PARM1=http%3A%2F%2Fexample.com%2Fapp%3Fls%3D1%2526mt%3D8',
      )
      const expected = 'http://example.com/app?ls=1%26mt=8'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })
  })

  describe('fs-bin stat with RD_PARM1', () => {
    it('should extract target encoded twice', () => {
      const value = new URL(
        'http://click.linksynergy.com/fs-bin/stat?id=abc&offerid=78941&type=3&subid=0&tmpid=1826&RD_PARM1=http%253A%252F%252Fexample.com%252Falbum%253Fid%253D322871516%2526s%253D143441',
      )
      const expected = 'http://example.com/album?id=322871516&s=143441'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })

    it('should extract target encoded twice with a tail encoded once', () => {
      const value = new URL(
        'http://click.linksynergy.com/fs-bin/stat?id=abc&offerid=94348&type=3&subid=0&tmpid=2192&RD_PARM1=http%253A%252F%252Fexample.com%252Falbum%253FplayListId%253D30646014%2526s%253D1%26partnerId%3D30',
      )
      const expected = 'http://example.com/album?playListId=30646014&s=1&partnerId=30'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })

    it('should return undefined when RD_PARM1 param is missing', () => {
      const value = new URL(
        'http://click.linksynergy.com/fs-bin/stat?id=abc&offerid=78941&type=3&subid=0',
      )

      expect(unwrapLinksynergy(value)).toBeUndefined()
    })
  })

  describe('linksynergy.jrs5.com host', () => {
    it('should extract target from link murl param', () => {
      const value = new URL(
        'https://linksynergy.jrs5.com/link?id=abc&offerid=457038.3123729&type=2&murl=http%3A%2F%2Fexample.com%2Fgoods%3Fno%3D3123729',
      )
      const expected = 'http://example.com/goods?no=3123729'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })
  })

  describe('linksynergy.walmart.com host', () => {
    it('should extract target from deeplink murl param', () => {
      const value = new URL(
        'http://linksynergy.walmart.com/deeplink?id=abc&mid=2149&murl=https%3A%2F%2Fexample.com%2F',
      )
      const expected = 'https://example.com/'

      expect(unwrapLinksynergy(value)).toBe(expected)
    })
  })

  it('should keep the wrapper for a non-http target', () => {
    const value =
      'http://click.linksynergy.com/fs-bin/click?id=abc&RD_PARM1=javascript%253Aalert(1)'

    expect(purifyUrl(value, { unwrappers: [unwrapLinksynergy] })).toBe(value)
  })

  it('should keep the wrapper for a malformed percent-encoded target', () => {
    const value = 'http://click.linksynergy.com/fs-bin/click?id=abc&RD_PARM1=http%25E0%25A4%25A'

    expect(purifyUrl(value, { unwrappers: [unwrapLinksynergy] })).toBe(value)
  })

  it('should return undefined for murl on an fs-bin path', () => {
    const value = new URL(
      'http://click.linksynergy.com/fs-bin/click?id=abc&murl=https%3A%2F%2Fexample.com',
    )

    expect(unwrapLinksynergy(value)).toBeUndefined()
  })

  it('should return undefined for other paths', () => {
    const value = new URL('https://click.linksynergy.com/click?murl=https%3A%2F%2Fexample.com')

    expect(unwrapLinksynergy(value)).toBeUndefined()
  })

  it('should return undefined for non-LinkSynergy hosts', () => {
    const value = new URL('https://example.com/deeplink?murl=https%3A%2F%2Fexample.org')

    expect(unwrapLinksynergy(value)).toBeUndefined()
  })
})
