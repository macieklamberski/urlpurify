import { describe, expect, it } from 'bun:test'
import { unwrapCloudhq } from './cloudhq.js'

describe('unwrapCloudhq', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://cloudhq-mkt1.net/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?uid=665487&url=http%3A%2F%2Fexample.org',
    )
    const expected = 'http://example.org'

    expect(unwrapCloudhq(value)).toBe(expected)
  })

  it('should extract target on a www host of the us family', () => {
    const value = new URL(
      'https://www.cloudhq-mkt29.us/mail_track/link/c06adc57c4147cdb02_1722790056267?uid=2516841&url=https%3A%2F%2Fexample.com%2Ffile%2Fd%2F13rHInQY4P1%2Fview',
    )
    const expected = 'https://example.com/file/d/13rHInQY4P1/view'

    expect(unwrapCloudhq(value)).toBe(expected)
  })

  it('should extract target from a link with the unsent placeholder id', () => {
    const value = new URL(
      'https://www.cloudhq-mkt2.net/mail_track/link/_TEMP_TRACKER_ID_TO_BE_REPLACED_?uid=2552958&url=https%3A%2F%2Fexample.com%2F2023%2F10%2Fpost%2F',
    )
    const expected = 'https://example.com/2023/10/post/'

    expect(unwrapCloudhq(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL(
      'https://cloudhq-mkt1.net/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?uid=665487',
    )

    expect(unwrapCloudhq(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'https://cloudhq-mkt1.net/mail_track/open/e53e5ea68cf36da807487a3e43ba11e4?url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(value)).toBeUndefined()
  })

  it('should return undefined for a host without a number', () => {
    const value = new URL(
      'https://cloudhq-mkt.net/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://examplecloudhq-mkt1.net/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a family host', () => {
    const value = new URL(
      'https://cloudhq-mkt1.net.example.com/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(value)).toBeUndefined()
  })

  it('should return undefined for a path below a link', () => {
    const value = new URL(
      'https://cloudhq-mkt1.net/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4/extra?uid=665487&url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(value)).toBeUndefined()
  })
})
