import { describe, expect, it } from 'bun:test'
import { unwrapHubspotSidekick } from './hubspotSidekick.js'

describe('unwrapHubspotSidekick', () => {
  it('should extract target from t param on the e1t path', () => {
    const url = new URL(
      'http://t.sidekickopen69.com/e1t/c/5/f18dQhb0S7lM8dDMPbW2n0x6l2B9nMJN7t5X-FdSD1CW65jsKF7dSnQlV1ZVF94KMyK8103?t=http%3A%2F%2Fexample.com%2Fspursshow&si=7000000000578938&pi=8831f501-8d53-4f7e-9d0b-3',
    )

    expect(unwrapHubspotSidekick(url)).toBe('http://example.com/spursshow')
  })

  it('should extract target from t param on the s1t path', () => {
    const url = new URL(
      'https://t.sidekickopen05.com/s1t/c/5/f18dQhb0S7lC8dDMPbW2n0x6l2B9nMJW7t5XZs5wvF6bW4WzxVx8q-8m4W1q7mhC56dz8bf8Nchpz02?t=https%3A%2F%2Fwww.example.com%2Fsmall-business-hra-guide&si=5935918600000000',
    )

    expect(unwrapHubspotSidekick(url)).toBe('https://www.example.com/small-business-hra-guide')
  })

  it('should extract target from t param on the s2t path', () => {
    const url = new URL(
      'https://t.sidekickopen72.com/s2t/c/5/f18dQhb0S7lM8dDMPbW2n0x6l2B9nMJN7t5X-FfhMynN4Xr2psQBdTFW56dVP48QqLgj102?t=https%3A%2F%2Fwww.example.com%2FDear-Universe&si=7000000000578938',
    )

    expect(unwrapHubspotSidekick(url)).toBe('https://www.example.com/Dear-Universe')
  })

  it('should extract target from t param on a Signals host', () => {
    const url = new URL(
      'http://t.signauxdeux.com/e1t/c/5/f18dQhb0SmZ58dDMPbW2n0x6l2B9nMJW7sM9dn7dK_MMdBzM2-04?t=https%3A%2F%2Fexample.com%2Fb%2Fku6aGkKi%2Falc-annual-report&si=5000000000000000',
    )

    expect(unwrapHubspotSidekick(url)).toBe('https://example.com/b/ku6aGkKi/alc-annual-report')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'http://t.sidekickopen04.com/e1t/c/5/f18dQhb0S7lC8dDMPbW2n0x6l2B9nMJW7t5XX43M2w8vW7fR_6z63Bt1-VcVQQM56dT2wdD3ZBY02?t=https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dfeeds%26page%3D2&si=5211409303470080',
    )

    expect(unwrapHubspotSidekick(url)).toBe('https://example.com/search?q=feeds&page=2')
  })

  it('should return undefined when t param is missing', () => {
    const url = new URL(
      'http://t.sidekickopen69.com/e1t/c/5/f18dQhb0S7lM8dDMPbW2n0x6l2B9nMJN7t5X-FdSD1CW65jsKF7dSnQlV1ZVF94KMyK8103?si=7000000000578938',
    )

    expect(unwrapHubspotSidekick(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://t.sidekickopen68.com/Ctc/OQ+23284/cY92C04?t=https%3A%2F%2Fexample.com',
    )

    expect(unwrapHubspotSidekick(url)).toBeUndefined()
  })

  it('should return undefined for a host without a number', () => {
    const url = new URL(
      'http://t.sidekickopen.com/e1t/c/5/f18dQhb0S7lM8dDMPbW2n0x6l2B9nMJN7t5X?t=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapHubspotSidekick(url)).toBeUndefined()
  })

  it('should return undefined for a host that ends with the family name', () => {
    const url = new URL(
      'http://nott.sidekickopen69.com/e1t/c/5/f18dQhb0S7lM8dDMPbW2n0x6l2B9nMJN7t5X?t=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapHubspotSidekick(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the family name', () => {
    const url = new URL(
      'http://t.sidekickopen69.com.example.net/e1t/c/5/f18dQhb0S7lM8dDMPbW2n0x6l2B9nMJN7t5X?t=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapHubspotSidekick(url)).toBeUndefined()
  })

  it('should return undefined for another subdomain of a family host', () => {
    const url = new URL(
      'http://www.sidekickopen69.com/e1t/c/5/f18dQhb0S7lM8dDMPbW2n0x6l2B9nMJN7t5X?t=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapHubspotSidekick(url)).toBeUndefined()
  })

  it('should return undefined for a path with a segment before the click path', () => {
    const url = new URL(
      'http://t.sidekickopen69.com/report/e1t/c/5/f18dQhb0S7lM8dDMPbW2n0x6l2B9nMJN7t5X?t=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapHubspotSidekick(url)).toBeUndefined()
  })

  it('should return undefined for a path with a segment after the click path', () => {
    const url = new URL(
      'http://t.sidekickopen69.com/e1t/c/5/f18dQhb0S7lM8dDMPbW2n0x6l2B9nMJN7t5X/report?t=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapHubspotSidekick(url)).toBeUndefined()
  })
})
