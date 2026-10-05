import { describe, expect, it } from 'bun:test'
import { unwrapSquarespaceEmail } from './squarespaceEmail.js'

describe('unwrapSquarespaceEmail', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://engage.squarespace-mail.com/r?m=62fa3558e47c07605909c810&u=https%3A%2F%2Fwww.example.com%2F&w=5ccc848d071c02000143def8&l=en-US&s=78AaTuIKCk9mhRErhLuiaPq8_lA%3D',
    )

    expect(unwrapSquarespaceEmail(url)).toBe('https://www.example.com/')
  })

  it('should extract target on a four-character subdomain', () => {
    const url = new URL(
      'https://f69e.engage.squarespace-mail.com/r?m=6585badce9d37244c6e65389&u=https%3A%2F%2Fexample.com%2Ffile%2Fview&w=6225055c65eac13c52a9560d&c=b_6585b7c16fd6e04a4fa332e7&l=en-US',
    )

    expect(unwrapSquarespaceEmail(url)).toBe('https://example.com/file/view')
  })

  it('should extract target on a numbered mgcp subdomain', () => {
    const url = new URL(
      'https://mgcp01.engage.squarespace-mail.com/r?m=6288257c45fa5f7d5499b35f&u=https%3A%2F%2Fwww.example.com%2Fwatch%3Fv%3DPY9DcIMGxMs&w=5c1a9ece1137a6630fdd2055&l=en-US&s=_sxYR3OV8FA8y1pBdwxh9l-0PNY%3D',
    )

    expect(unwrapSquarespaceEmail(url)).toBe('https://www.example.com/watch?v=PY9DcIMGxMs')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://a1e0.engage.squarespace-mail.com/r?m=60184f916142313653c39608&u=https%3A%2F%2Fexample.com%2Fpost%3Fss_source%3Dsscampaigns%26ss_campaign_id%3D5f0496&w=5e71322d8a502a5b82782703&l=en-US',
    )

    expect(unwrapSquarespaceEmail(url)).toBe(
      'https://example.com/post?ss_source=sscampaigns&ss_campaign_id=5f0496',
    )
  })

  it('should extract target encoded twice', () => {
    const url = new URL(
      'https://engage.squarespace-mail.com/r?m=62fa3558e47c07605909c810&u=https%253A%252F%252Fexample.com%252Fpage&l=en-US',
    )

    expect(unwrapSquarespaceEmail(url)).toBe('https://example.com/page')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://engage.squarespace-mail.com/r?m=62fa3558e47c07605909c810&l=en-US')

    expect(unwrapSquarespaceEmail(url)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const url = new URL('https://engage.squarespace-mail.com/r?m=62fa3558e47c07605909c810&u=')

    expect(unwrapSquarespaceEmail(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://engage.squarespace-mail.com/o?m=abc&u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapSquarespaceEmail(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/r?u=https%3A%2F%2Fexample.org%2Fpage')

    expect(unwrapSquarespaceEmail(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://engage.examplesquarespace-mail.com/r?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSquarespaceEmail(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the domain', () => {
    const url = new URL(
      'https://engage.squarespace-mail.com.example.com/r?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSquarespaceEmail(url)).toBeUndefined()
  })

  it('should return undefined for a longer subdomain', () => {
    const url = new URL(
      'https://news.f69e.engage.squarespace-mail.com/r?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSquarespaceEmail(url)).toBeUndefined()
  })
})
