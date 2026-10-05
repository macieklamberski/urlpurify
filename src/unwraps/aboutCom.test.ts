import { describe, expect, it } from 'bun:test'
import { unwrapAboutCom } from './aboutCom.js'

describe('unwrapAboutCom', () => {
  it('should extract the target from the zu param', () => {
    const url = new URL(
      'http://websearch.about.com/gi/dynamic/offsite.htm?zi=1/XJ&sdn=websearch&zu=http%3A%2F%2Fwww.example.com%2Fwindows%2Fdownload%2FAllDownloads.aspx%3Fdisplang%3Den',
    )

    expect(unwrapAboutCom(url)).toBe(
      'http://www.example.com/windows/download/AllDownloads.aspx?displang=en',
    )
  })

  it('should extract the target from the site param', () => {
    const url = new URL(
      'http://racerelations.about.com/gi/dynamic/offsite.htm?site=http://www.example.com/news/ledger/index.ssf%3F/base/news%2D3/1144819010259650.xml',
    )

    expect(unwrapAboutCom(url)).toBe(
      'http://www.example.com/news/ledger/index.ssf?/base/news-3/1144819010259650.xml',
    )
  })

  it('should return undefined for another path on a topic host', () => {
    const url = new URL(
      'http://freebies.about.com/gi/pages/shareurl.htm?zu=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAboutCom(url)).toBeUndefined()
  })

  it('should return undefined for the path on a host that only ends with the domain', () => {
    const url = new URL('http://notabout.com/gi/dynamic/offsite.htm?zu=http%3A%2F%2Fexample.com%2F')

    expect(unwrapAboutCom(url)).toBeUndefined()
  })
})
