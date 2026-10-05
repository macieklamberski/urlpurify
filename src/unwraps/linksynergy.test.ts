import { describe, expect, it } from 'bun:test'
import { unwrapLinksynergy } from './linksynergy.js'

describe('unwrapLinksynergy', () => {
  describe('deeplink with murl', () => {
    it('should extract target from murl param', () => {
      const url = new URL(
        'https://click.linksynergy.com/deeplink?id=abc&mid=12345&murl=https%3A%2F%2Fexample.com%2Fproduct',
      )

      expect(unwrapLinksynergy(url)).toBe('https://example.com/product')
    })

    it('should return undefined when murl param is missing', () => {
      const url = new URL('https://click.linksynergy.com/deeplink?id=abc&mid=12345')

      expect(unwrapLinksynergy(url)).toBeUndefined()
    })
  })

  describe('link with murl', () => {
    it('should extract target from murl param', () => {
      const url = new URL(
        'https://click.linksynergy.com/link?id=abc&murl=https%3A%2F%2Fexample.com%2Fproduct%2F10297&offerid=115554.10000488&type=3',
      )

      expect(unwrapLinksynergy(url)).toBe('https://example.com/product/10297')
    })
  })

  describe('fs-bin click with RD_PARM1', () => {
    it('should extract target encoded once', () => {
      const url = new URL(
        'http://click.linksynergy.com/fs-bin/click?id=abc&subid=&offerid=146261.1&type=10&tmpid=3909&RD_PARM1=http%3A%2F%2Fexample.com%2Fapp%2Fid492561899',
      )

      expect(unwrapLinksynergy(url)).toBe('http://example.com/app/id492561899')
    })

    it('should extract target encoded twice', () => {
      const url = new URL(
        'http://click.linksynergy.com/fs-bin/click?id=abc&subid=0&offerid=223073.1&type=10&tmpid=1082&RD_PARM1=https%253A%252F%252Fexample.com%252Fcp%252Fregistry%252F1229485',
      )

      expect(unwrapLinksynergy(url)).toBe('https://example.com/cp/registry/1229485')
    })

    it('should not decode a target that is already an http url', () => {
      const url = new URL(
        'http://click.linksynergy.com/fs-bin/click?id=abc&offerid=146261.1&type=10&RD_PARM1=http%3A%2F%2Fexample.com%2Fapp%3Fls%3D1%2526mt%3D8',
      )

      expect(unwrapLinksynergy(url)).toBe('http://example.com/app?ls=1%26mt=8')
    })
  })

  describe('fs-bin stat with RD_PARM1', () => {
    it('should extract target encoded twice', () => {
      const url = new URL(
        'http://click.linksynergy.com/fs-bin/stat?id=abc&offerid=78941&type=3&subid=0&tmpid=1826&RD_PARM1=http%253A%252F%252Fexample.com%252Falbum%253Fid%253D322871516%2526s%253D143441',
      )

      expect(unwrapLinksynergy(url)).toBe('http://example.com/album?id=322871516&s=143441')
    })

    it('should extract target encoded twice with a tail encoded once', () => {
      const url = new URL(
        'http://click.linksynergy.com/fs-bin/stat?id=abc&offerid=94348&type=3&subid=0&tmpid=2192&RD_PARM1=http%253A%252F%252Fexample.com%252Falbum%253FplayListId%253D30646014%2526s%253D1%26partnerId%3D30',
      )

      expect(unwrapLinksynergy(url)).toBe(
        'http://example.com/album?playListId=30646014&s=1&partnerId=30',
      )
    })

    it('should return undefined when RD_PARM1 param is missing', () => {
      const url = new URL(
        'http://click.linksynergy.com/fs-bin/stat?id=abc&offerid=78941&type=3&subid=0',
      )

      expect(unwrapLinksynergy(url)).toBeUndefined()
    })
  })

  describe('linksynergy.jrs5.com host', () => {
    it('should extract target from link murl param', () => {
      const url = new URL(
        'https://linksynergy.jrs5.com/link?id=abc&offerid=457038.3123729&type=2&murl=http%3A%2F%2Fexample.com%2Fgoods%3Fno%3D3123729',
      )

      expect(unwrapLinksynergy(url)).toBe('http://example.com/goods?no=3123729')
    })
  })

  describe('linksynergy.walmart.com host', () => {
    it('should extract target from deeplink murl param', () => {
      const url = new URL(
        'http://linksynergy.walmart.com/deeplink?id=abc&mid=2149&murl=https%3A%2F%2Fexample.com%2F',
      )

      expect(unwrapLinksynergy(url)).toBe('https://example.com/')
    })
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://click.linksynergy.com/fs-bin/click?id=abc&RD_PARM1=javascript%253Aalert(1)',
    )

    expect(unwrapLinksynergy(url)).toBeUndefined()
  })

  it('should return undefined for a malformed percent-encoded target', () => {
    const url = new URL(
      'http://click.linksynergy.com/fs-bin/click?id=abc&RD_PARM1=http%25E0%25A4%25A',
    )

    expect(unwrapLinksynergy(url)).toBeUndefined()
  })

  it('should return undefined for murl on an fs-bin path', () => {
    const url = new URL(
      'http://click.linksynergy.com/fs-bin/click?id=abc&murl=https%3A%2F%2Fexample.com',
    )

    expect(unwrapLinksynergy(url)).toBeUndefined()
  })

  it('should return undefined for other paths', () => {
    const url = new URL('https://click.linksynergy.com/click?murl=https%3A%2F%2Fexample.com')

    expect(unwrapLinksynergy(url)).toBeUndefined()
  })

  it('should return undefined for non-LinkSynergy hosts', () => {
    const url = new URL('https://example.com/deeplink?murl=https%3A%2F%2Fexample.org')

    expect(unwrapLinksynergy(url)).toBeUndefined()
  })
})
