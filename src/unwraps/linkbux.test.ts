import { describe, expect, it } from 'bun:test'
import { unwrapLinkbux } from './linkbux.js'

describe('unwrapLinkbux', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://www.linkbux.com/track/5959sJwNS3Dyjh2Jh3ewIQIO1PMzwWwAxnZyCWcKaJIFSAXsLGUEtS98NbueiU_algnlc?url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLinkbux(url)).toBe('https://www.example.com/')
  })

  it('should extract target from url param before uid', () => {
    const url = new URL(
      'https://www.linkbux.com/track/e266uWOnCOlkX6woQDCFs3dUTD57c2EajL_aOE9LBtEaNMDXGGuaAd0iCEANyHpwod2qxgTOd3maDVlg_c?url=https%3A%2F%2Fwww.example.com%2Fshop&uid=63523bd176755c47d5ce7d9f-RL-246703',
    )

    expect(unwrapLinkbux(url)).toBe('https://www.example.com/shop')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL(
      'https://www.linkbux.com/track/5959sJwNS3Dyjh2Jh3ewIQIO1PMzwWwAxnZyCWcKaJIFSAXsLGUEtS98NbueiU_algnlc',
    )

    expect(unwrapLinkbux(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Linkbux host', () => {
    const url = new URL('https://www.linkbux.com/track/a/b?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLinkbux(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/track/5959sJwNS3Dyjh2Jh3ewIQ?url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLinkbux(url)).toBeUndefined()
  })
})
