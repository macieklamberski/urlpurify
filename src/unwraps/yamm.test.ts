import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapYamm } from './yamm.js'

describe('unwrapYamm', () => {
  it('should extract target from link param on a sender host', () => {
    const value = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Redirect?ukey=1b2gWLExqb7wH_-pFl9V4b75EylvsQz6N903fGMhdVpY-1097021115&key=YAMMID-97877214&link=https%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapYamm(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Redirect?ukey=1b2gWLExqb7wH_-pFl9V4b75EylvsQz6N903fGMhdVpY-1097021115&key=YAMMID-97877214&link=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapYamm(value)).toBe(expected)
  })

  it('should extract an unencoded target on the bare host', () => {
    const value = new URL(
      'https://yamm-track.appspot.com/Redirect?ukey=1184QrcnZlSXDxHwnt3rro_6n8qAQ78_qo-p0yRs_M08-0&key=YAMMID-22712985&link=https://example.com/tactical5d',
    )
    const expected = 'https://example.com/tactical5d'

    expect(unwrapYamm(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://mercyforanimals-dot-yamm-track.appspot.com/Redirect?ukey=1q2fxCsIjekh_u8pfLfdcZGHaUknXz1f-dCE7iDoPzEk-0&key=YAMMID-64168662&link=http%253A%252F%252Fwww.example.com%252Frecipes',
    )
    const expected = 'http://www.example.com/recipes'

    expect(unwrapYamm(value)).toBe(expected)
  })

  it('should extract the last link param of an unencoded nested tracker', () => {
    const value = new URL(
      'https://ull-edu-dot-yamm-track.appspot.com/Redirect?ukey=128XZHQySTsDLfsoiKvqdP5gh5UbaxcMgTA43BlPpp50-0&key=YAMMID-15818271&link=https://fe-ccoo-dot-yamm-track.appspot.com/Redirect?ukey=1KBfuCthfXaHX-M8b9cEh5QMGK7VXjah6EZqeZfOuqoM-0&key=YAMMID-14556257&link=https://www.example.es/portal/site/universidades/',
    )
    const expected = 'https://www.example.es/portal/site/universidades/'

    expect(unwrapYamm(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Redirect?key=YAMMID-97877214&link=https%253A%252F%252Fwww.example.com%252F100%25',
    )
    const expected = 'https://www.example.com/100%'

    expect(unwrapYamm(value)).toBe(expected)
  })

  it('should return undefined when link param is missing', () => {
    const value = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Redirect?ukey=1b2gWLExqb7wH&key=YAMMID-97877214',
    )

    expect(unwrapYamm(value)).toBeUndefined()
  })

  it('should return undefined when link param is empty', () => {
    const value = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Redirect?ukey=1b2gWLExqb7wH&key=YAMMID-97877214&link=',
    )

    expect(unwrapYamm(value)).toBeUndefined()
  })

  it('should return undefined for another path on a sender host', () => {
    const value = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Track?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapYamm(value)).toBeUndefined()
  })

  it('should return undefined for the path on another App Engine app', () => {
    const value = new URL(
      'https://scribemedia-dot-example-app.appspot.com/Redirect?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapYamm(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike app', () => {
    const value = new URL(
      'https://notyamm-track.appspot.com/Redirect?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapYamm(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a sender host', () => {
    const value = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com.example.net/Redirect?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapYamm(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapYamm)).toBe(true)
  })
})
