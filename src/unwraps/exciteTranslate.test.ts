import { describe, expect, it } from 'bun:test'
import { unwrapExciteTranslate } from './exciteTranslate.js'

describe('unwrapExciteTranslate', () => {
  it('should extract the target from the translation page', () => {
    const url = new URL(
      'http://excite.co.jp/world/english/web/body/?wb_url=http%3A%2F%2Fwww.example.jp%2Fhistory.htm&wb_lp=JAEN&wb_dis=2',
    )

    expect(unwrapExciteTranslate(url)).toBe('http://www.example.jp/history.htm')
  })

  it('should extract the target from the translation form path', () => {
    const url = new URL(
      'http://www.excite-webtl.jp/world/chinese/web/?wb_url=http%3A%2F%2Fnews.example.cn%2F2009%2F06%2F03%2F2044637.html&wb_lp=CHJA',
    )

    expect(unwrapExciteTranslate(url)).toBe('http://news.example.cn/2009/06/03/2044637.html')
  })

  it('should return undefined when the wb_url param is missing', () => {
    const url = new URL('http://www.excite.co.jp/world/english/web/?wb_lp=JAEN')

    expect(unwrapExciteTranslate(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'http://www.excite.co.jp/world/english/?wb_url=http%3A%2F%2Fwww.example.jp%2F&wb_lp=JAEN',
    )

    expect(unwrapExciteTranslate(url)).toBeUndefined()
  })
})
