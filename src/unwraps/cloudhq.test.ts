import { describe, expect, it } from 'bun:test'
import { unwrapCloudhq } from './cloudhq.js'

describe('unwrapCloudhq', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://cloudhq-mkt1.net/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?uid=665487&url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(url)).toBe('http://example.org')
  })

  it('should extract target on a www host of the us family', () => {
    const url = new URL(
      'https://www.cloudhq-mkt29.us/mail_track/link/c06adc57c4147cdb02_1722790056267?uid=2516841&url=https%3A%2F%2Fexample.com%2Ffile%2Fd%2F13rHInQY4P1%2Fview',
    )

    expect(unwrapCloudhq(url)).toBe('https://example.com/file/d/13rHInQY4P1/view')
  })

  it('should extract target from a link with the unsent placeholder id', () => {
    const url = new URL(
      'https://www.cloudhq-mkt2.net/mail_track/link/_TEMP_TRACKER_ID_TO_BE_REPLACED_?uid=2552958&url=https%3A%2F%2Fexample.com%2F2023%2F10%2Fpost%2F',
    )

    expect(unwrapCloudhq(url)).toBe('https://example.com/2023/10/post/')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL(
      'https://cloudhq-mkt1.net/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?uid=665487',
    )

    expect(unwrapCloudhq(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://cloudhq-mkt1.net/mail_track/open/e53e5ea68cf36da807487a3e43ba11e4?url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(url)).toBeUndefined()
  })

  it('should return undefined for a host without a number', () => {
    const url = new URL(
      'https://cloudhq-mkt.net/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://examplecloudhq-mkt1.net/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a family host', () => {
    const url = new URL(
      'https://cloudhq-mkt1.net.example.com/mail_track/link/e53e5ea68cf36da807487a3e43ba11e4?url=http%3A%2F%2Fexample.org',
    )

    expect(unwrapCloudhq(url)).toBeUndefined()
  })
})
