import { describe, expect, it } from 'bun:test'
import { unwrapQualityClick } from './qualityClick.js'

describe('unwrapQualityClick', () => {
  it('should extract a plain target from target param', () => {
    const url = new URL(
      'https://partner.example.com/go.cgi?pid=101&wmid=cc&cpid=1&target=https://www.example.com/jpcng/classic/detail/-/hnum/11108719',
    )

    expect(unwrapQualityClick(url)).toBe(
      'https://www.example.com/jpcng/classic/detail/-/hnum/11108719',
    )
  })

  it('should extract the target with subid, prid and view params', () => {
    const url = new URL(
      'https://partner.example.com/go.cgi?pid=10000743&wmid=101&cpid=1&prid=1&subid=&view=1&target=https://www.example.com/wp-content/uploads/sites/11/2023/05/banner.jpg',
    )

    expect(unwrapQualityClick(url)).toBe(
      'https://www.example.com/wp-content/uploads/sites/11/2023/05/banner.jpg',
    )
  })

  it('should extract a percent-encoded target', () => {
    const url = new URL(
      'https://partner.example.com/go.cgi?pid=101&wmid=cc&cpid=1&target=https%3A%2F%2Fwww.example.com%2Fdetail%3Fid%3D1',
    )

    expect(unwrapQualityClick(url)).toBe('https://www.example.com/detail?id=1')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://partner.example.com/go.cgi?pid=101&wmid=cc&cpid=1&target=https%253A%252F%252Fwww.example.com%252Fdetail',
    )

    expect(unwrapQualityClick(url)).toBe('https://www.example.com/detail')
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const url = new URL(
      'https://partner.example.com/go.cgi?pid=101&wmid=cc&cpid=1&target=https%253A%252F%252Fwww.example.com%252F100%25',
    )

    expect(unwrapQualityClick(url)).toBe('https://www.example.com/100%')
  })

  it('should return undefined for another script on go.cgi', () => {
    const url = new URL('https://www.example.com/go.cgi?url=https://www.example.org/')

    expect(unwrapQualityClick(url)).toBeUndefined()
  })

  it('should return undefined when pid is missing', () => {
    const url = new URL(
      'https://partner.example.com/go.cgi?wmid=cc&cpid=1&target=https://www.example.com/',
    )

    expect(unwrapQualityClick(url)).toBeUndefined()
  })

  it('should return undefined when wmid is missing', () => {
    const url = new URL(
      'https://partner.example.com/go.cgi?pid=101&cpid=1&target=https://www.example.com/',
    )

    expect(unwrapQualityClick(url)).toBeUndefined()
  })

  it('should return undefined for go.cgi under a directory', () => {
    const url = new URL(
      'https://www.example.com/rank/go.cgi?pid=101&wmid=cc&target=https://www.example.org/',
    )

    expect(unwrapQualityClick(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://partner.example.com/go.cgi?pid=101&wmid=cc&cpid=1&target=javascript%3Aalert(1)',
    )

    expect(unwrapQualityClick(url)).toBeUndefined()
  })

  it('should return undefined when target is empty', () => {
    const url = new URL('https://partner.example.com/go.cgi?pid=101&wmid=cc&cpid=1&target=')

    expect(unwrapQualityClick(url)).toBeUndefined()
  })

  it('should return undefined when target is missing', () => {
    const url = new URL('https://partner.example.com/go.cgi?pid=101&wmid=cc&cpid=1')

    expect(unwrapQualityClick(url)).toBeUndefined()
  })
})
