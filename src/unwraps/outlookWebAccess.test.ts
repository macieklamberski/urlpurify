import { describe, expect, it } from 'bun:test'
import { unwrapOutlookWebAccess } from './outlookWebAccess.js'

describe('unwrapOutlookWebAccess', () => {
  it('should extract target from the owa redir.aspx shim', () => {
    const url = new URL(
      'https://webmail.example.org/owa/redir.aspx?C=KwklBeQqIEGufaohydg70Xi2UatAi9ZIhh3TgX5ZFL4HDJ9y7Y6W3CrqdcsWvol7driSgAV2DNc.&URL=https%3a%2f%2fwww.example.com%2fevent%2f970904%2f',
    )

    expect(unwrapOutlookWebAccess(url)).toBe('https://www.example.com/event/970904/')
  })

  it('should extract target from the uppercase OWA path', () => {
    const url = new URL(
      'https://owa.example.ac.uk/OWA/redir.aspx?C=b5179a3ad8fb45f8ad7e6130bb7afcdc&URL=http%3a%2f%2fwww.example.com%2fcms%2fs%2f2%2f141f425e.html',
    )

    expect(unwrapOutlookWebAccess(url)).toBe('http://www.example.com/cms/s/2/141f425e.html')
  })

  it('should extract target from the Exchange 2010 path with the build', () => {
    const url = new URL(
      'https://mail.example.ie/owa/14.1.355.2/scripts/premium/redir.aspx?C=be990771cf944550b1042c9664eca3e1&URL=http%3a%2f%2fwww.example.com%2fpdf%2f2013_07.pdf',
    )

    expect(unwrapOutlookWebAccess(url)).toBe('http://www.example.com/pdf/2013_07.pdf')
  })

  it('should extract target from the explicit logon path with the mailbox', () => {
    const url = new URL(
      'https://email.example.org/owa/jane@example.org/redir.aspx?C=cTPl2H6fZX_lGB7vHoIqjKw0gQKhTNEIP0cSLp1mySFRSPHED-7XCA..&URL=http%3a%2f%2fwww.example.com%2fmap',
    )

    expect(unwrapOutlookWebAccess(url)).toBe('http://www.example.com/map')
  })

  it('should extract target from the exchweb redir.asp shim', () => {
    const url = new URL(
      'https://mail.example.com/exchweb/bin/redir.asp?URL=http://www.example.org/',
    )

    expect(unwrapOutlookWebAccess(url)).toBe('http://www.example.org/')
  })

  it('should extract target when SURL sits beside URL', () => {
    const url = new URL(
      'https://mail.example.it/owa/redir.aspx?SURL=M3uhAs3YUx9zQQMi-GFTel5fi9NWvyCgq9_ktiuZyj6FcmyCBFbSCGgAdAB0AHAAOgAvAC8A.&URL=http%3a%2f%2fwww.example.com%2fpage.htm',
    )

    expect(unwrapOutlookWebAccess(url)).toBe('http://www.example.com/page.htm')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'https://webmail.example.fr/owa/redir.aspx?C=jZEjxKkhrwjT7IgZKY.&URL=http%3a%2f%2fwww.example.com%2fbbsView.do%3fbbs_cd_n%3d2%26bbs_seq_n%3d779',
    )

    expect(unwrapOutlookWebAccess(url)).toBe(
      'http://www.example.com/bbsView.do?bbs_cd_n=2&bbs_seq_n=779',
    )
  })

  it('should decode a twice-encoded target', () => {
    const url = new URL(
      'https://mail.example.com/owa/redir.aspx?C=FxLT3ERNZUOMlMgbeBczBDtdGRzXKtII.&URL=http%253a%252f%252fwww.example.com%252f2014%252f05%252fidea-machine%252f',
    )

    expect(unwrapOutlookWebAccess(url)).toBe('http://www.example.com/2014/05/idea-machine/')
  })

  it('should return undefined when only the opaque SURL is present', () => {
    const url = new URL(
      'https://mail.example.it/owa/redir.aspx?SURL=M3uhAs3YUx9zQQMi-GFTel5fi9NWvyCgq9_ktiuZyj6FcmyCBFbSCGgAdAB0AHAAOgAvAC8A.',
    )

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL(
      'https://webmail.example.org/owa/auth/logon.aspx?URL=https%3a%2f%2fwww.example.com%2f',
    )

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })

  it('should return undefined for another page under the Exchange 2010 build path', () => {
    const url = new URL(
      'https://mail.example.ie/owa/14.1.355.2/scripts/premium/attach.aspx?URL=http%3a%2f%2fwww.example.com%2f',
    )

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })

  it('should return undefined for redir.aspx under another owa folder', () => {
    const url = new URL(
      'https://webmail.example.org/owa/auth/redir.aspx?URL=http%3a%2f%2fwww.example.com%2f',
    )

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })

  it('should return undefined for the premium scripts path under a folder that is not a build', () => {
    const url = new URL(
      'https://webmail.example.org/owa/auth/scripts/premium/redir.aspx?URL=http%3a%2f%2fwww.example.com%2f',
    )

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with the exchweb shim', () => {
    const url = new URL(
      'https://mail.example.com/exchweb/bin/redir.aspx?URL=http://www.example.com/',
    )

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })

  it('should return undefined for the path under a context path', () => {
    const url = new URL(
      'https://www.example.org/news/exchweb/bin/redir.asp?URL=http://www.example.com/',
    )

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://webmail.example.org/owa/redir.aspx?C=KwklBeQqIEGufaohydg70Xi2.&URL=mailto%3ajane%40example.com',
    )

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })

  it('should return undefined when URL is missing', () => {
    const url = new URL('https://webmail.example.org/owa/redir.aspx?C=KwklBeQqIEGufaohydg70Xi2.')

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })

  it('should return undefined when URL is empty', () => {
    const url = new URL(
      'https://webmail.example.org/owa/redir.aspx?C=KwklBeQqIEGufaohydg70Xi2.&URL=',
    )

    expect(unwrapOutlookWebAccess(url)).toBeUndefined()
  })
})
