import { describe, expect, it } from 'bun:test'
import { unwrapElasticEmail } from './elasticEmail.js'

describe('unwrapElasticEmail', () => {
  it('should extract target from target param on a sender host', () => {
    const url = new URL(
      'http://tracking.assomusica.org/tracking/click?msgid=Hq17hf_18KKEOrxUqkC5fQ2&target=http%3a%2f%2fwww.example.org%2findex.php%3fsubid%3d2&lc=1&v=',
    )

    expect(unwrapElasticEmail(url)).toBe('http://www.example.org/index.php?subid=2')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://www.example.com/tracking/click?msgid=Hq17hf_18KKEOrxUqkC5fQ2&target=https://example.org/search/a+b&lc=1&v=',
    )

    expect(unwrapElasticEmail(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract target from target param on an Elastic Email host', () => {
    const url = new URL(
      'http://m7r7.trk.elasticemail.com/tracking/click?msgid=2rLfZC2rjxYb2xeZ4Ov1ow2&target=https%3a%2f%2fexample.com%2fevents&v=',
    )

    expect(unwrapElasticEmail(url)).toBe('https://example.com/events')
  })

  it('should return undefined for the opaque d shape', () => {
    const url = new URL(
      'http://tracking.vuelio.co.uk/tracking/click?d=FVPol_Buren9Kfrj_Xmn8-61i4PamTcVtyrcf0kP4Q4Ocf1lCC',
    )

    expect(unwrapElasticEmail(url)).toBeUndefined()
  })

  it('should return undefined without msgid param', () => {
    const url = new URL('https://example.com/tracking/click?target=https%3a%2f%2fexample.org%2f')

    expect(unwrapElasticEmail(url)).toBeUndefined()
  })

  it('should return undefined when target param is missing', () => {
    const url = new URL(
      'http://tracking.assomusica.org/tracking/click?msgid=Hq17hf_18KKEOrxUqkC5fQ2',
    )

    expect(unwrapElasticEmail(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://tracking.assomusica.org/tracking/click?msgid=Hq17hf_18KKEOrxUqkC5fQ2&target=javascript%3aalert(1)',
    )

    expect(unwrapElasticEmail(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path', () => {
    const url = new URL(
      'http://tracking.assomusica.org/tracking/click/extra?msgid=Hq17hf_18KKEOrxUqkC5fQ2&target=https%3a%2f%2fexample.org%2f',
    )

    expect(unwrapElasticEmail(url)).toBeUndefined()
  })
})
