import { describe, expect, it } from 'bun:test'
import { unwrapInfospace } from './infospace.js'

describe('unwrapInfospace', () => {
  it('should extract the target from the ru param', () => {
    const value = new URL(
      'http://click.infospace.com/ClickHandler.ashx?du=http%3a%2f%2f3.bp.example.com%2fimg.jpg&ru=http%3a%2f%2f3.bp.example.com%2fimg.jpg&ld=20120105&ap=1&app=1&c=dogpile',
    )
    const expected = 'http://3.bp.example.com/img.jpg'

    expect(unwrapInfospace(value)).toBe(expected)
  })

  it('should return undefined when only the display url is present', () => {
    const value = new URL(
      'http://click.infospace.com/ClickHandler.ashx?du=example.com%2fpage&c=dogpile',
    )

    expect(unwrapInfospace(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('http://click.infospace.com/other.ashx?ru=http%3a%2f%2fexample.com%2f')

    expect(unwrapInfospace(value)).toBeUndefined()
  })
})
