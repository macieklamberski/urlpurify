import { describe, expect, it } from 'bun:test'
import { unwrapTitanhqLinklock } from './titanhqLinklock.js'

describe('unwrapTitanhqLinklock', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://linklock.titanhq.com/analyse?url=https%3A%2F%2Fwww.example.com%2Foccupancy-standards-in-condos%2F&data=eJxsykFPgzAYxvFPUw4mb0NLYZBYY2HrRSeEzIPHl5YFdLTLytLs2xt303h78vx_RhYb5FiyI-RMFCA2VQU',
    )
    const expected = 'https://www.example.com/occupancy-standards-in-condos/'

    expect(unwrapTitanhqLinklock(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://linklock.titanhq.com/analyse?url=https%3A%2F%2Fexample.com%2F%3Futm_source%3Dinstagram%26utm_medium%3Dstories&data=eJxdzL0OgjAUBeCngQ1DKWIYOvgTFhcTQxxNaa-l0bbQ2yby9hbjZHKXc76TK1',
    )
    const expected = 'https://example.com/?utm_source=instagram&utm_medium=stories'

    expect(unwrapTitanhqLinklock(value)).toBe(expected)
  })

  it('should extract target encoded twice', () => {
    const value = new URL(
      'https://linklock.titanhq.com/analyse?url=http%253A%252F%252Fexample.com%252Fracing&data=eJw8yUFrgzAUwPFPEw8Dh02eJsIy5gqhbAe3ltLz4yXRdFoljZT56cd66OV_-P9IO28r4WuZOylsDpXEvAbAvHSWFErgUpWZ1U_ZqF-2zbtv668D3lrT9tUpusv-uFu',
    )
    const expected = 'http://example.com/racing'

    expect(unwrapTitanhqLinklock(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL(
      'https://linklock.titanhq.com/analyse?data=eJxsykFPgzAYxvFPUw4mb0NLYZBYY2HrRSeEzIPHl5YFdLTLytLs2xt303h78vx_RhYb5FiyI',
    )

    expect(unwrapTitanhqLinklock(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL(
      'https://linklock.titanhq.com/analyse?url=&data=eJxsykFPgzAYxvFPUw4mb0NLYZBYY2HrRSeEzIPHl5YFdLTLytLs2xt303h78vx_RhYb5FiyI',
    )

    expect(unwrapTitanhqLinklock(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://linklock.titanhq.com/report?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapTitanhqLinklock(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/analyse?url=https%3A%2F%2Fexample.org%2Fpage')

    expect(unwrapTitanhqLinklock(value)).toBeUndefined()
  })
})
