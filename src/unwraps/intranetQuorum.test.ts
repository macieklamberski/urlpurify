import { describe, expect, it } from 'bun:test'
import { unwrapIntranetQuorum } from './intranetQuorum.js'

describe('unwrapIntranetQuorum', () => {
  it('should extract target from redirect param', () => {
    const url = new URL(
      'https://outreach.senate.gov/iqextranet/iqClickTrk.aspx?&cid=SenSanders&crop=19423.66543112.11802280.731960744&report_id=&redirect=https%3a%2f%2fwww.example.org%2fwp-content%2fuploads%2fExec-Summary.pdf',
    )

    expect(unwrapIntranetQuorum(url)).toBe(
      'https://www.example.org/wp-content/uploads/Exec-Summary.pdf',
    )
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'https://iqconnect.lmhostediq.com/iqextranet/iqClickTrk.aspx?&cid=DCWARD1&crop=14263.2533333.2015546.7187065&report_id=&redirect=https%3a%2f%2fexample.org%2fdefault.do%3fnomenu%3dtrue%26q%3da%2520b&redir_log=755306855872867',
    )

    expect(unwrapIntranetQuorum(url)).toBe('https://example.org/default.do?nomenu=true&q=a%20b')
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL(
      'https://iqconnect.house.gov/iqextranet/iqUnsubscribe.aspx?redirect=https%3a%2f%2fexample.org%2f',
    )

    expect(unwrapIntranetQuorum(url)).toBeUndefined()
  })

  it('should return undefined when redirect param is missing', () => {
    const url = new URL(
      'https://outreach.senate.gov/iqextranet/iqClickTrk.aspx?&cid=SenSanders&report_id=',
    )

    expect(unwrapIntranetQuorum(url)).toBeUndefined()
  })
})
