import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapDeployer } from './deployer.js'

describe('unwrapDeployer', () => {
  it('should give https to a decoded target without a scheme', () => {
    const value =
      'https://myjw.pr.judicialwatch.org/link.php?&L=1&M=30382579&N=61024&AGENCY=jw&drurl=d3d3LmV4YW1wbGUuY29tL3Bvc3Q='
    const expected = 'https://www.example.com/post'

    expect(purifyUrl(value, { unwrappers: [unwrapDeployer] })).toBe(expected)
  })

  it('should extract target from drurl param', () => {
    const value = new URL(
      'https://myjw.pr.judicialwatch.org/link.php?AGENCY=jw&M=22362233&N=60546&L=28220&F=H&drurl=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvZG9jdW1lbnRzL2p3LXYtaGhzLz91dG1fc291cmNlPWRlcGxveWVy',
    )
    const expected = 'https://www.example.org/documents/jw-v-hhs/?utm_source=deployer'

    expect(unwrapDeployer(value)).toBe(expected)
  })

  it('should extract target from the wta path', () => {
    const value = new URL(
      'https://myjw.pr.judicialwatch.org/wta/link.php?AGENCY=jw&M=5331514&N=48026&L=17923&F=H&drurl=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvZG9jdW1lbnRzLw==',
    )
    const expected = 'https://www.example.org/documents/'

    expect(unwrapDeployer(value)).toBe(expected)
  })

  it('should extract target beside a hash param', () => {
    const value = new URL(
      'https://daily.news.humanevents.com/link.php?AGENCY=THEPM&M=1949878&N=18207&L=3285&F=H&drurl=aHR0cHM6Ly9leGFtcGxlLmNvbS8=&hash=5958c89a59f420136f62545cfaad559a95f1b42013e19822dae2e2afbaf9e30b',
    )
    const expected = 'https://example.com/'

    expect(unwrapDeployer(value)).toBe(expected)
  })

  it('should keep a plus of the base64 alphabet', () => {
    const value = new URL(
      'https://myjw.pr.judicialwatch.org/link.php?AGENCY=jw&M=22362233&N=60546&L=28220&F=H&drurl=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvIzp+OnRleHQ9VGhl',
    )
    const expected = 'https://www.example.org/#:~:text=The'

    expect(unwrapDeployer(value)).toBe(expected)
  })

  it('should keep the wrapper for a relative drurl', () => {
    const value =
      'https://myjw.pr.judicialwatch.org/link.php?&L=1&M=30382579&N=61024&AGENCY=jw&drurl=ZGlzcGxheS5waHA/TT0zMDM4MjU3OQ=='

    expect(purifyUrl(value, { unwrappers: [unwrapDeployer] })).toBe(value)
  })

  it('should return undefined when drurl param is missing', () => {
    const value = new URL(
      'https://myjw.pr.judicialwatch.org/link.php?AGENCY=jw&M=22362233&N=60546&L=28220&F=H',
    )

    expect(unwrapDeployer(value)).toBeUndefined()
  })

  it('should return undefined without AGENCY', () => {
    const value = new URL(
      'https://myjw.pr.judicialwatch.org/link.php?M=22362233&drurl=aHR0cHM6Ly9leGFtcGxlLmNvbS8=',
    )

    expect(unwrapDeployer(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'https://myjw.pr.judicialwatch.org/display.php?AGENCY=jw&M=22362233&drurl=aHR0cHM6Ly9leGFtcGxlLmNvbS8=',
    )

    expect(unwrapDeployer(value)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const value = new URL(
      'https://news.example.com/link.php?AGENCY=jw&M=22362233&drurl=aHR0cHM6Ly9leGFtcGxlLmNvbS8=',
    )

    expect(unwrapDeployer(value)).toBeUndefined()
  })
})
