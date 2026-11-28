import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapAboutCom } from './aboutCom.js'

describe('unwrapAboutCom', () => {
  it('should extract the target from the zu param', () => {
    const value = new URL(
      'http://websearch.about.com/gi/dynamic/offsite.htm?zi=1/XJ&sdn=websearch&zu=http%3A%2F%2Fwww.example.com%2Fwindows%2Fdownload%2FAllDownloads.aspx%3Fdisplang%3Den',
    )
    const expected = 'http://www.example.com/windows/download/AllDownloads.aspx?displang=en'

    expect(unwrapAboutCom(value)).toBe(expected)
  })

  it('should extract the target from the site param', () => {
    const value = new URL(
      'http://racerelations.about.com/gi/dynamic/offsite.htm?site=http://www.example.com/news/ledger/index.ssf%3F/base/news%2D3/1144819010259650.xml',
    )
    const expected =
      'http://www.example.com/news/ledger/index.ssf?/base/news-3/1144819010259650.xml'

    expect(unwrapAboutCom(value)).toBe(expected)
  })

  it('should extract the target from the leaving page', () => {
    const value = new URL(
      'http://pcsupport.about.com/gi/o.htm?zi=1/XJ&zTi=1&sdn=pcsupport&zu=http%3A//www.example.com/download/en/details.aspx%3Fid%3D7264',
    )
    const expected = 'http://www.example.com/download/en/details.aspx?id=7264'

    expect(unwrapAboutCom(value)).toBe(expected)
  })

  it('should return undefined for another path on a topic host', () => {
    const value = new URL(
      'http://freebies.about.com/gi/pages/shareurl.htm?zu=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAboutCom(value)).toBeUndefined()
  })

  it('should return undefined for the path on a host that only ends with the domain', () => {
    const value = new URL(
      'http://notabout.com/gi/dynamic/offsite.htm?zu=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAboutCom(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapAboutCom)).toBe(true)
  })
})
