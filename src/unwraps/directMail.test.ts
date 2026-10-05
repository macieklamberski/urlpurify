import { describe, expect, it } from 'bun:test'
import { unwrapDirectMail } from './directMail.js'

describe('unwrapDirectMail', () => {
  it('should extract target from a click link', () => {
    const url = new URL(
      'https://dmanalytics2.com/click?u=https%3A%2F%2Fwww.example.com%2F&i=1&d=ZgTnucV8TiiO2hYsPntG_g&e=reader%40example.org&a=AZc2m1-jc-i_JkTfwU0U&s=bZ2kkHuT8Og',
    )

    expect(unwrapDirectMail(url)).toBe('https://www.example.com/')
  })

  it('should extract target from a click link on a sender subdomain', () => {
    const url = new URL(
      'https://lightyearsahead.dmanalytics2.com/click?u=https%3A%2F%2Fexample.com%2Fmusic%2F&i=2&d=nWosjuibS2mDtHY0JoHu8g&e=reader%40example.org&a=UDrYgHtkTDOB9X661O7CTg',
    )

    expect(unwrapDirectMail(url)).toBe('https://example.com/music/')
  })

  it('should extract target from a legacy mail link', () => {
    const url = new URL(
      'http://ethreemail.com/e3ds/mail_link.php?u=http%3A%2F%2Fwww.example.com%2Fcurrent.html&i=0&d=991A75B9-10F2-44EE-91C3-B365AE4547FE&e=reader@example.org',
    )

    expect(unwrapDirectMail(url)).toBe('http://www.example.com/current.html')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://dmanalytics2.com/click?i=1&d=ZgTnucV8TiiO2hYsPntG_g')

    expect(unwrapDirectMail(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracker host', () => {
    const url = new URL(
      'https://dmanalytics2.com/s/manual-redirect?url=https%3A%2F%2Fexample.com%2F&u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDirectMail(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the domain', () => {
    const url = new URL('https://exampledmanalytics2.com/click?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapDirectMail(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the domain', () => {
    const url = new URL('https://dmanalytics2.com.example.com/click?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapDirectMail(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/click?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapDirectMail(url)).toBeUndefined()
  })
})
