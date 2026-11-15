import { describe, expect, it } from 'bun:test'
import { unwrapOkShare } from './okShare.js'

describe('unwrapOkShare', () => {
  it('should extract a raw target from st._surl on the addShare command', () => {
    const value = new URL(
      'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=http://example.com/',
    )
    const expected = 'http://example.com/'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from st._surl', () => {
    const value = new URL(
      'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st.comments=THE+DOT-COM+CITY&st._surl=http%3A%2F%2Fexample.com%2Fen%2Fpress%2Fbooks%2Fthe-dotcom-city',
    )
    const expected = 'http://example.com/en/press/books/the-dotcom-city'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should extract the target from st._surl on ok.ru', () => {
    const value = new URL(
      'https://ok.ru/dk?st.cmd=addShare&st._surl=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should match the addShare command in any case', () => {
    const value = new URL(
      'https://ok.ru/dk?st.cmd=AddShare&st._surl=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should match the /dk path in any case', () => {
    const value = new URL(
      'https://ok.ru/DK?st.cmd=addShare&st._surl=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should extract the target from url on connect.ok.ru/offer', () => {
    const value = new URL(
      'https://connect.ok.ru/offer?url=https%3A%2F%2Fexample.com%2Farticles%2F158801&title=%D0%90%D1%80%D0%B5%D1%81%D1%82&utm_source=share2',
    )
    const expected = 'https://example.com/articles/158801'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should extract a raw target from url on connect.ok.ru/offer', () => {
    const value = new URL(
      'https://connect.ok.ru/offer?url=https://example.com/blog/samye-poddelyvaemye-tovary-v-rossii/',
    )
    const expected = 'https://example.com/blog/samye-poddelyvaemye-tovary-v-rossii/'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should read url over imageUrl on connect.ok.ru/offer', () => {
    const value = new URL(
      'https://connect.ok.ru/offer?imageUrl=https%3A%2F%2Fexample.org%2Fpics%2F5887441.png&url=https%3A%2F%2Fexample.com%2Fdoc%2F5887441&title=Doc',
    )
    const expected = 'https://example.com/doc/5887441'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should extract the target from st.shareUrl on the WidgetShare command', () => {
    const value = new URL(
      'https://connect.ok.ru/dk?st.cmd=WidgetShare&st.shareUrl=http%3A%2F%2Fexample.com%2Fru%2Fincidents%2Fnews%2F126812%3F10&st.fid=__okShare1&st.hoster=http%3A%2F%2Fexample.org%2F',
    )
    const expected = 'http://example.com/ru/incidents/news/126812?10'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should extract the target from st.shareUrl on the WidgetSharePreview command', () => {
    const value = new URL(
      'http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl=https%3A%2F%2Fexample.com%2Farticle14510',
    )
    const expected = 'https://example.com/article14510'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://connect.ok.ru/offer?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapOkShare(value)).toBe(expected)
  })

  it('should return undefined when st._surl is empty', () => {
    const value = new URL('https://ok.ru/dk?st.cmd=addShare&st._surl=')

    expect(unwrapOkShare(value)).toBeUndefined()
  })

  it('should return undefined for st._surl under another command', () => {
    const value = new URL(
      'https://ok.ru/dk?st.cmd=userMain&st._surl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOkShare(value)).toBeUndefined()
  })

  it('should return undefined for the addShare command on another path', () => {
    const value = new URL(
      'https://ok.ru/group/dk?st.cmd=addShare&st._surl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOkShare(value)).toBeUndefined()
  })

  it('should return undefined for the logExternal link shim', () => {
    const value = new URL(
      'https://ok.ru/dk?cmd=logExternal&st.cmd=logExternal&st.link=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOkShare(value)).toBeUndefined()
  })

  it('should return undefined for url on another connect.ok.ru path', () => {
    const value = new URL('https://connect.ok.ru/news?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapOkShare(value)).toBeUndefined()
  })

  it('should return undefined for st.shareUrl under another command', () => {
    const value = new URL(
      'https://connect.ok.ru/dk?st.cmd=OAuth2Login&st.shareUrl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOkShare(value)).toBeUndefined()
  })

  it('should return undefined for the WidgetShare command on another path', () => {
    const value = new URL(
      'https://connect.ok.ru/widget?st.cmd=WidgetShare&st.shareUrl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOkShare(value)).toBeUndefined()
  })

  it('should return undefined for the offer shape on ok.ru', () => {
    const value = new URL('https://ok.ru/offer?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapOkShare(value)).toBeUndefined()
  })

  it('should return undefined for the offer shape on another host', () => {
    const value = new URL('https://www.example.org/offer?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapOkShare(value)).toBeUndefined()
  })

  it('should return undefined for the addShare shape on another host', () => {
    const value = new URL(
      'https://www.example.org/dk?st.cmd=addShare&st._surl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOkShare(value)).toBeUndefined()
  })
})
