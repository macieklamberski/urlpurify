import { describe, expect, it } from 'bun:test'
import { unwrapWebgains } from './webgains.js'

describe('unwrapWebgains', () => {
  it('should extract an unencoded target from wgtarget param', () => {
    const value = new URL(
      'https://track.webgains.com/click.html?wgcampaignid=1542435&wgprogramid=10949&wgtarget=https://www.example.com/shop/item-848479',
    )
    const expected = 'https://www.example.com/shop/item-848479'

    expect(unwrapWebgains(value)).toBe(expected)
  })

  it('should extract an encoded target', () => {
    const value = new URL(
      'http://track.webgains.com/click.html?wgcampaignid=54264&wgprogramid=12765&clickref=87732X1540624X72e3bf55d71a8ef9dc88899492cdc21f&wgtarget=http%3A%2F%2Fwww.example.com%2Finsights%2Freport.html',
    )
    const expected = 'http://www.example.com/insights/report.html'

    expect(unwrapWebgains(value)).toBe(expected)
  })

  it('should extract a target that holds an encoded percent sign', () => {
    const value = new URL(
      'https://track.webgains.com/click.html?wgcampaignid=138485&wgprogramid=265545&wgtarget=https%3A%2F%2Fwww.example.com%2Fcase%2F80028-O%252FS.html%3Fsource%3Dfeed',
    )
    const expected = 'https://www.example.com/case/80028-O%2FS.html?source=feed'

    expect(unwrapWebgains(value)).toBe(expected)
  })

  it('should extract target when wglinkid and clickref are present', () => {
    const value = new URL(
      'https://track.webgains.com/click.html?wglinkid=2810975&wgprogramid=272915&clickref=widget&wgcampaignid=159293&wgtarget=https://www.example.com',
    )
    const expected = 'https://www.example.com'

    expect(unwrapWebgains(value)).toBe(expected)
  })

  it('should return undefined when wgtarget param is missing', () => {
    const value = new URL(
      'https://track.webgains.com/click.html?wgcampaignid=1542435&wgprogramid=10949',
    )

    expect(unwrapWebgains(value)).toBeUndefined()
  })

  it('should return undefined when wgtarget param is empty', () => {
    const value = new URL('https://track.webgains.com/click.html?wgcampaignid=1542435&wgtarget=')

    expect(unwrapWebgains(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path carrying wgtarget', () => {
    const value = new URL(
      'https://track.webgains.com/redirect.html?wgtarget=https://www.example.com/',
    )

    expect(unwrapWebgains(value)).toBeUndefined()
  })

  it('should return undefined for another page on the domain', () => {
    const value = new URL('https://www.webgains.com/?wgtarget=https://www.example.com/')

    expect(unwrapWebgains(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://track.example.com/click.html?wgtarget=https://www.example.org/')

    expect(unwrapWebgains(value)).toBeUndefined()
  })
})
