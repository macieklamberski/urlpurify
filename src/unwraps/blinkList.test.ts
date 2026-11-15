import { describe, expect, it } from 'bun:test'
import { unwrapBlinkList } from './blinkList.js'

describe('unwrapBlinkList', () => {
  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'http://www.blinklist.com/index.php?Action=Blink/addblink.php&Description=&Url=http%3A%2F%2Fmozyto.example.com%2F2009%2F10%2F15%2Fearthlings-descarga-torrent&Title=Earthlings',
    )
    const expected = 'http://mozyto.example.com/2009/10/15/earthlings-descarga-torrent'

    expect(unwrapBlinkList(value)).toBe(expected)
  })

  it('should keep the encoded query of the target', () => {
    const value = new URL(
      'http://www.blinklist.com/index.php?Action=Blink/addblink.php&Description=&Url=http%3A%2F%2Fwww.example.com%2F%3Fp%3D594&Title=Taking%20the%20Leap%3A%20On%20Writing%20Full%20Time',
    )
    const expected = 'http://www.example.com/?p=594'

    expect(unwrapBlinkList(value)).toBe(expected)
  })

  it('should extract a raw target', () => {
    const value = new URL(
      'http://www.blinklist.com/index.php?Action=Blink/addblink.php&Description=&Url=http://jonswift.example.com/2009/03/why-bristol-palin-is-different.html&Title=Why',
    )
    const expected = 'http://jonswift.example.com/2009/03/why-bristol-palin-is-different.html'

    expect(unwrapBlinkList(value)).toBe(expected)
  })

  it('should extract a target with encoded dots and dashes', () => {
    const value = new URL(
      'http://www.blinklist.com/index.php?Action=Blink/addblink.php&Url=http%3A%2F%2Fcloggerblog%2Eexample%2Ecom%2F2006%2F07%2Ffive%2Dalive%2Ehtml&Title=Five%20Alive',
    )
    const expected = 'http://cloggerblog.example.com/2006/07/five-alive.html'

    expect(unwrapBlinkList(value)).toBe(expected)
  })

  it('should extract the target from the lowercase url param', () => {
    const value = new URL(
      'http://www.blinklist.com/index.php?Action=Blink/addblink.php&url=http://www.example.com/bumrush&title=Bum%20Rush%20The%20Charts',
    )
    const expected = 'http://www.example.com/bumrush'

    expect(unwrapBlinkList(value)).toBe(expected)
  })

  it('should extract the target on the bare host', () => {
    const value = new URL(
      'http://blinklist.com/index.php?Action=Blink/addblink.php&Description=&Url=http%3A%2F%2Fexample.com%2F2009%2F06%2F16%2Fucsb-investigation&Title=UCSB',
    )
    const expected = 'http://example.com/2009/06/16/ucsb-investigation'

    expect(unwrapBlinkList(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'http://www.blinklist.com/index.php?Action=Blink/addblink.php&Url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapBlinkList(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'http://www.blinklist.com/Index.php?Action=Blink/addblink.php&Url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapBlinkList(value)).toBe(expected)
  })

  it('should return undefined when the Url param is empty', () => {
    const value = new URL(
      'http://www.blinklist.com/index.php?Action=Blink/addblink.php&Description=&Url=&Title=Post',
    )

    expect(unwrapBlinkList(value)).toBeUndefined()
  })

  it('should return undefined for the redirect path', () => {
    const value = new URL(
      'http://www.blinklist.com/redirect/1164770/http://example.com/project/showfiles.php?group_id=110693',
    )

    expect(unwrapBlinkList(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'http://www.example.com/index.php?Action=Blink/addblink.php&Url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapBlinkList(value)).toBeUndefined()
  })
})
