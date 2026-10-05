import { describe, expect, it } from 'bun:test'
import { unwrapReverbnation } from './reverbnation.js'

describe('unwrapReverbnation', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'http://www.rvrb.me/fan_reach/pt?eid=V108089_21063999_21947530_lnk1001&url=http%3A%2F%2Fwww.example.com',
    )

    expect(unwrapReverbnation(url)).toBe('http://www.example.com')
  })

  it('should extract target from rn_url param', () => {
    const url = new URL(
      'http://www.rvrb.me/fan_reach/pt?eid=A387089_32438668_16126174_lnk1001&utm_campaign=fanreach&utm_medium=email&rn_url=http%3A%2F%2Fwww.example.edu%2FEducation%2FYAP',
    )

    expect(unwrapReverbnation(url)).toBe('http://www.example.edu/Education/YAP')
  })

  it('should extract an unencoded target on www.reverbnation.com', () => {
    const url = new URL(
      'https://www.reverbnation.com/fan_reach/pt?eid=A1400698_15419901__lnk1004&url=https://example.rs/',
    )

    expect(unwrapReverbnation(url)).toBe('https://example.rs/')
  })

  it('should return undefined when both carriers are missing', () => {
    const url = new URL('http://www.rvrb.me/fan_reach/pt?eid=V108089_21063999_21947530_lnk1001')

    expect(unwrapReverbnation(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://www.reverbnation.com/widgets/tune_widget/tuneWidget.swf?url=http%3A%2F%2Fwww.example.com',
    )

    expect(unwrapReverbnation(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('https://example.com/fan_reach/pt?url=http%3A%2F%2Fwww.example.org')

    expect(unwrapReverbnation(url)).toBeUndefined()
  })
})
