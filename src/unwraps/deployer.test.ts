import { describe, expect, it } from 'bun:test'
import { unwrapDeployer } from './deployer.js'

describe('unwrapDeployer', () => {
  it('should extract target from drurl param', () => {
    const url = new URL(
      'https://myjw.pr.judicialwatch.org/link.php?AGENCY=jw&M=22362233&N=60546&L=28220&F=H&drurl=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvZG9jdW1lbnRzL2p3LXYtaGhzLz91dG1fc291cmNlPWRlcGxveWVy',
    )

    expect(unwrapDeployer(url)).toBe(
      'https://www.example.org/documents/jw-v-hhs/?utm_source=deployer',
    )
  })

  it('should extract target from the wta path', () => {
    const url = new URL(
      'https://myjw.pr.judicialwatch.org/wta/link.php?AGENCY=jw&M=5331514&N=48026&L=17923&F=H&drurl=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvZG9jdW1lbnRzLw==',
    )

    expect(unwrapDeployer(url)).toBe('https://www.example.org/documents/')
  })

  it('should extract target beside a hash param', () => {
    const url = new URL(
      'https://daily.news.humanevents.com/link.php?AGENCY=THEPM&M=1949878&N=18207&L=3285&F=H&drurl=aHR0cHM6Ly9leGFtcGxlLmNvbS8=&hash=5958c89a59f420136f62545cfaad559a95f1b42013e19822dae2e2afbaf9e30b',
    )

    expect(unwrapDeployer(url)).toBe('https://example.com/')
  })

  it('should keep a plus of the base64 alphabet', () => {
    const url = new URL(
      'https://myjw.pr.judicialwatch.org/link.php?AGENCY=jw&M=22362233&N=60546&L=28220&F=H&drurl=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvIzp+OnRleHQ9VGhl',
    )

    expect(unwrapDeployer(url)).toBe('https://www.example.org/#:~:text=The')
  })

  it('should return undefined for a relative drurl', () => {
    const url = new URL(
      'https://myjw.pr.judicialwatch.org/link.php?&L=1&M=30382579&N=61024&AGENCY=jw&drurl=ZGlzcGxheS5waHA/TT0zMDM4MjU3OQ==',
    )

    expect(unwrapDeployer(url)).toBeUndefined()
  })

  it('should return undefined when drurl param is missing', () => {
    const url = new URL(
      'https://myjw.pr.judicialwatch.org/link.php?AGENCY=jw&M=22362233&N=60546&L=28220&F=H',
    )

    expect(unwrapDeployer(url)).toBeUndefined()
  })

  it('should return undefined without AGENCY', () => {
    const url = new URL(
      'https://myjw.pr.judicialwatch.org/link.php?M=22362233&drurl=aHR0cHM6Ly9leGFtcGxlLmNvbS8=',
    )

    expect(unwrapDeployer(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://myjw.pr.judicialwatch.org/display.php?AGENCY=jw&M=22362233&drurl=aHR0cHM6Ly9leGFtcGxlLmNvbS8=',
    )

    expect(unwrapDeployer(url)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const url = new URL(
      'https://news.example.com/link.php?AGENCY=jw&M=22362233&drurl=aHR0cHM6Ly9leGFtcGxlLmNvbS8=',
    )

    expect(unwrapDeployer(url)).toBeUndefined()
  })
})
