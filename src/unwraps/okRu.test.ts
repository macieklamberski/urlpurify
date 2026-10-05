import { describe, expect, it } from 'bun:test'
import { unwrapOkRu } from './okRu.js'

describe('unwrapOkRu', () => {
  it('should extract target from st.link on the logExternal command', () => {
    const url = new URL(
      'https://ok.ru/dk?cmd=logExternal&st.cmd=logExternal&st.sig=grn4-lLl-mT6Kj03fazaGcXEq2QIoInWux3YxQHyBAQ&st.link=http%3A%2F%2Fexample.com%2Fshoes&st.name=externalLinkRedirect&st.tid=71250360123566',
    )

    expect(unwrapOkRu(url)).toBe('http://example.com/shoes')
  })

  it('should extract target from st.link when only cmd names logExternal', () => {
    const url = new URL(
      'https://ok.ru/dk?cmd=logExternal&st.name=externalLinkRedirect&st.link=http%3A%2F%2Fexample.com',
    )

    expect(unwrapOkRu(url)).toBe('http://example.com')
  })

  it('should extract target from st.rfn on the outLinkWarning page', () => {
    const url = new URL(
      'https://m.ok.ru/dk?st.cmd=outLinkWarning&st.rfn=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapOkRu(url)).toBe('https://example.com/')
  })

  it('should return undefined for the addShare share intent on the same path', () => {
    const url = new URL(
      'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=http://example.com/',
    )

    expect(unwrapOkRu(url)).toBeUndefined()
  })

  it('should return undefined for the widget share preview', () => {
    const url = new URL(
      'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=https%3A%2F%2Fexample.com',
    )

    expect(unwrapOkRu(url)).toBeUndefined()
  })

  it('should return undefined for the logExternal command on another path', () => {
    const url = new URL('https://ok.ru/profile?cmd=logExternal&st.link=http%3A%2F%2Fexample.com')

    expect(unwrapOkRu(url)).toBeUndefined()
  })

  it('should return undefined when st.link is missing', () => {
    const url = new URL('https://ok.ru/dk?cmd=logExternal&st.name=externalLinkRedirect')

    expect(unwrapOkRu(url)).toBeUndefined()
  })

  it('should return undefined for the shape on a non-OK.ru host', () => {
    const url = new URL('https://example.com/dk?cmd=logExternal&st.link=http%3A%2F%2Fexample.org')

    expect(unwrapOkRu(url)).toBeUndefined()
  })
})
