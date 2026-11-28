import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapDirectMail } from './directMail.js'

describe('unwrapDirectMail', () => {
  it('should extract target from a click link', () => {
    const value = new URL(
      'https://dmanalytics2.com/click?u=https%3A%2F%2Fwww.example.com%2F&i=1&d=ZgTnucV8TiiO2hYsPntG_g&e=reader%40example.org&a=AZc2m1-jc-i_JkTfwU0U&s=bZ2kkHuT8Og',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapDirectMail(value)).toBe(expected)
  })

  it('should extract target from a click link on a sender subdomain', () => {
    const value = new URL(
      'https://lightyearsahead.dmanalytics2.com/click?u=https%3A%2F%2Fexample.com%2Fmusic%2F&i=2&d=nWosjuibS2mDtHY0JoHu8g&e=reader%40example.org&a=UDrYgHtkTDOB9X661O7CTg',
    )
    const expected = 'https://example.com/music/'

    expect(unwrapDirectMail(value)).toBe(expected)
  })

  it('should extract target from a legacy mail link', () => {
    const value = new URL(
      'http://ethreemail.com/e3ds/mail_link.php?u=http%3A%2F%2Fwww.example.com%2Fcurrent.html&i=0&d=991A75B9-10F2-44EE-91C3-B365AE4547FE&e=reader@example.org',
    )
    const expected = 'http://www.example.com/current.html'

    expect(unwrapDirectMail(value)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://dmanalytics2.com/click?i=1&d=ZgTnucV8TiiO2hYsPntG_g')

    expect(unwrapDirectMail(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracker host', () => {
    const value = new URL(
      'https://dmanalytics2.com/s/manual-redirect?url=https%3A%2F%2Fexample.com%2F&u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDirectMail(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the domain', () => {
    const value = new URL('https://exampledmanalytics2.com/click?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapDirectMail(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the domain', () => {
    const value = new URL(
      'https://dmanalytics2.com.example.com/click?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDirectMail(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/click?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapDirectMail(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapDirectMail)).toBe(true)
  })
})
