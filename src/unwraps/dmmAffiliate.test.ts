import { describe, expect, it } from 'bun:test'
import { unwrapDmmAffiliate } from './dmmAffiliate.js'

describe('unwrapDmmAffiliate', () => {
  it('should extract target from lurl param on al.fanza.co.jp', () => {
    const url = new URL(
      'https://al.fanza.co.jp/?lurl=https%3A%2F%2Fexample.com%2Fav%2Fcontent%2F%3Fid%3D406maraa00229&af_id=pjtmmmm-038&ch=toolbar&ch_id=link',
    )

    expect(unwrapDmmAffiliate(url)).toBe('https://example.com/av/content/?id=406maraa00229')
  })

  it('should extract target from lurl param on al.dmm.co.jp', () => {
    const url = new URL(
      'https://al.dmm.co.jp/?lurl=https%3A%2F%2Fexample.com%2Fdc%2Fdoujin%2F-%2Fdetail%2F%3D%2Fcid%3Dd_287923%2F&af_id=yuttan-002&ch=link_tool&ch_id=link',
    )

    expect(unwrapDmmAffiliate(url)).toBe('https://example.com/dc/doujin/-/detail/=/cid=d_287923/')
  })

  it('should extract target from lurl param on al.dmm.com', () => {
    const url = new URL(
      'https://al.dmm.com/?lurl=https%3A%2F%2Fexample.com%2Fbook%2Ffeature%2Fsupersale%2Findex.html&af_id=10799-078&ch=toolbar&ch_id=text',
    )

    expect(unwrapDmmAffiliate(url)).toBe('https://example.com/book/feature/supersale/index.html')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://al.dmm.co.jp/?lurl=https://example.com/mono/figure/-/detail/=/cid=fig_2606171533571/&af_id=fgs-013&ch=link_tool&ch_id=link',
    )

    expect(unwrapDmmAffiliate(url)).toBe(
      'https://example.com/mono/figure/-/detail/=/cid=fig_2606171533571/',
    )
  })

  it('should extract an unencoded target with a query of its own', () => {
    const url = new URL(
      'https://al.dmm.co.jp/?lurl=https://example.com/av/list/?actress=1050737&af_id=kavarero-019&ch=toolbar&ch_id=link',
    )

    expect(unwrapDmmAffiliate(url)).toBe('https://example.com/av/list/?actress=1050737')
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL(
      'https://www.fanza.co.jp/?lurl=https%3A%2F%2Fexample.com%2F&af_id=pjtmmmm-038',
    )

    expect(unwrapDmmAffiliate(url)).toBeUndefined()
  })

  it('should return undefined when lurl param is missing', () => {
    const url = new URL('https://al.dmm.co.jp/?af_id=pjtmmmm-038&ch=toolbar&ch_id=link')

    expect(unwrapDmmAffiliate(url)).toBeUndefined()
  })

  it('should return undefined when lurl param is empty', () => {
    const url = new URL('https://al.dmm.co.jp/?lurl=&af_id=pjtmmmm-038')

    expect(unwrapDmmAffiliate(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the DMM host', () => {
    const url = new URL(
      'https://rcv.ixd.dmm.com/api/surl?urid=WIUy3n0R&lurl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDmmAffiliate(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://al.notdmm.com/?lurl=https%3A%2F%2Fexample.com%2F')

    expect(unwrapDmmAffiliate(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains fanza.co.jp', () => {
    const url = new URL('https://al.fanza.co.jp.example.org/?lurl=https%3A%2F%2Fexample.com%2F')

    expect(unwrapDmmAffiliate(url)).toBeUndefined()
  })
})
