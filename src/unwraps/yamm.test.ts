import { describe, expect, it } from 'bun:test'
import { unwrapYamm } from './yamm.js'

describe('unwrapYamm', () => {
  it('should extract target from link param on a sender host', () => {
    const url = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Redirect?ukey=1b2gWLExqb7wH_-pFl9V4b75EylvsQz6N903fGMhdVpY-1097021115&key=YAMMID-97877214&link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapYamm(url)).toBe('https://www.example.com/')
  })

  it('should extract an unencoded target on the bare host', () => {
    const url = new URL(
      'https://yamm-track.appspot.com/Redirect?ukey=1184QrcnZlSXDxHwnt3rro_6n8qAQ78_qo-p0yRs_M08-0&key=YAMMID-22712985&link=https://example.com/tactical5d',
    )

    expect(unwrapYamm(url)).toBe('https://example.com/tactical5d')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://mercyforanimals-dot-yamm-track.appspot.com/Redirect?ukey=1q2fxCsIjekh_u8pfLfdcZGHaUknXz1f-dCE7iDoPzEk-0&key=YAMMID-64168662&link=http%253A%252F%252Fwww.example.com%252Frecipes',
    )

    expect(unwrapYamm(url)).toBe('http://www.example.com/recipes')
  })

  it('should extract the last link param of an unencoded nested tracker', () => {
    const url = new URL(
      'https://ull-edu-dot-yamm-track.appspot.com/Redirect?ukey=128XZHQySTsDLfsoiKvqdP5gh5UbaxcMgTA43BlPpp50-0&key=YAMMID-15818271&link=https://fe-ccoo-dot-yamm-track.appspot.com/Redirect?ukey=1KBfuCthfXaHX-M8b9cEh5QMGK7VXjah6EZqeZfOuqoM-0&key=YAMMID-14556257&link=https://www.example.es/portal/site/universidades/',
    )

    expect(unwrapYamm(url)).toBe('https://www.example.es/portal/site/universidades/')
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const url = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Redirect?key=YAMMID-97877214&link=https%253A%252F%252Fwww.example.com%252F100%25',
    )

    expect(unwrapYamm(url)).toBe('https://www.example.com/100%')
  })

  it('should return undefined when link param is missing', () => {
    const url = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Redirect?ukey=1b2gWLExqb7wH&key=YAMMID-97877214',
    )

    expect(unwrapYamm(url)).toBeUndefined()
  })

  it('should return undefined when link param is empty', () => {
    const url = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Redirect?ukey=1b2gWLExqb7wH&key=YAMMID-97877214&link=',
    )

    expect(unwrapYamm(url)).toBeUndefined()
  })

  it('should return undefined for another path on a sender host', () => {
    const url = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com/Track?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapYamm(url)).toBeUndefined()
  })

  it('should return undefined for the path on another App Engine app', () => {
    const url = new URL(
      'https://scribemedia-dot-example-app.appspot.com/Redirect?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapYamm(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike app', () => {
    const url = new URL(
      'https://notyamm-track.appspot.com/Redirect?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapYamm(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a sender host', () => {
    const url = new URL(
      'https://scribemedia-dot-yamm-track.appspot.com.example.net/Redirect?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapYamm(url)).toBeUndefined()
  })
})
