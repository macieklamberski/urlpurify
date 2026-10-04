import { describe, expect, it } from 'bun:test'
import { unwrapGoogleAds } from './googleAds.js'

describe('unwrapGoogleAds', () => {
  describe('google.<TLD>/aclk', () => {
    it('should extract a target whose query Google left half-encoded before ved', () => {
      const url = new URL(
        'https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjvifmN8OyRAxXngFAGHYJnLuQYACICCAEQAxoCZGc&co=1&ase=2&sig=AOD64_0FMFoO2orTMxgvAWZyUFhazmU0Ng&q&nis=4&adurl=https://example.com/generic/?utm_source%3Dgoogle%26utm_medium%3Dcpc&ved=2ahUKEwi4_67zmvqRAxV1m4kEHbcQCqwQ0Qx6BAgXEAE',
      )

      expect(unwrapGoogleAds(url)).toBe(
        'https://example.com/generic/?utm_source=google&utm_medium=cpc',
      )
    })

    it('should extract a percent-encoded target placed first', () => {
      const url = new URL(
        'https://www.google.com/aclk?adurl=https%3A%2F%2Fexample.com%2Fartists%2Fpage%3Fref_%3Dacq&ai=DChsSEwittoSpgPWRAxXFHq0GHceMDpsYACICCAEQABoCcHY&ase=2&sa=L&sig=AOD64_3Y5mPnSD92QFyieF2QaBtAoSFpnA&ved=2ahUKEwi4',
      )

      expect(unwrapGoogleAds(url)).toBe('https://example.com/artists/page?ref_=acq')
    })

    it('should extract a target from a country domain', () => {
      const url = new URL(
        'http://www.google.co.uk/aclk?sa=l&ai=CokscN7CJVaO1OqG8ywPz2JPAAdn&num=4&sig=AOD64_2Db0GFwsMRIfxkz717hzIIpP2kuQ&adurl=http://www.example.com&rct=j&q=example%20hotel&cad=rja',
      )

      expect(unwrapGoogleAds(url)).toBe('http://www.example.com')
    })
  })

  describe('{google.<TLD>,googleads.g.doubleclick.net,pagead2.googlesyndication.com}/pagead/iclk', () => {
    it('should extract a percent-encoded target from google.<TLD>', () => {
      const url = new URL(
        'http://www.google.at/pagead/iclk?sa=l&ai=BI-QuW4OBRo3EN4PcwQHq6ai7D8eSiyWfvN-bA-eB1HjAuAIIABABGAE4AVDa2cP4&adurl=https://example.com/accounts/login%3Fservice%3Dmail%26hl%3Dde',
      )

      expect(unwrapGoogleAds(url)).toBe('https://example.com/accounts/login?service=mail&hl=de')
    })

    it('should extract a target from googleads followed by the client param', () => {
      const url = new URL(
        'http://googleads.g.doubleclick.net/pagead/iclk?sa=l&ai=Bdmui4Eu3SYe-MpSAvQPU4NHYCIH0qJEBwcbCpQuxqomHGoCb7gIQARgB&num=1&adurl=http://example.com/GG31&client=ca-pub-1234567890123456',
      )

      expect(unwrapGoogleAds(url)).toBe('http://example.com/GG31')
    })

    it('should extract a target from pagead2.googlesyndication.com', () => {
      const url = new URL(
        'http://pagead2.googlesyndication.com/pagead/iclk?sa=l&ai=BG9KPILY3R6fEJ4Lw8wGH2N25A7TKtxect8mOAsCNtwGw8igQAhgC&num=2&adurl=http://www.example.com/microphones.htm&client=ca-pub-1234567890123456&nm=4',
      )

      expect(unwrapGoogleAds(url)).toBe('http://www.example.com/microphones.htm')
    })
  })

  describe('syndicatedsearch.goog/aclk', () => {
    it('should extract a target followed by Google params', () => {
      const url = new URL(
        'https://syndicatedsearch.goog/aclk?sa=L&ai=DChcSEwiWw_XevPGHAxV8oGgJHTsuAhEYABAHGgJ3Zg&co=1&gclid=EAIaIQobChMIlsP13rzxhwMVfKBoCR07LgIREAAYASAAEgIEAvD_BwE&sig=AOD64_1ndDSnHaibZ85XdUcci04M6836zA&adurl=https://www.example.com/%3Fgad_source%3D5&q=&nb=1&nm=5&nx=23&ny=16',
      )

      expect(unwrapGoogleAds(url)).toBe('https://www.example.com/?gad_source=5')
    })
  })

  describe('www.googleadservices.com/pagead/aclk', () => {
    it('should extract a target placed last', () => {
      const url = new URL(
        'https://www.googleadservices.com/pagead/aclk?sa=L&ai=C_nMd6do5XvKyBZKnzgWg34_wAoG8x7pb&num=1&sig=AOD64_3GJ0aXrGSI3fhIUzHHqVZqVIa4yA&client=ca-pub-1234567890123456&adurl=https://example.com/landing/',
      )

      expect(unwrapGoogleAds(url)).toBe('https://example.com/landing/')
    })

    it('should extract a percent-encoded target placed first', () => {
      const url = new URL(
        'https://www.googleadservices.com/pagead/aclk?adurl=https%3A%2F%2Fexample.com%2Fwedding%3Futm_medium%3Dsem%26utm_source%3Dgoogle&ae=2&ai=CSZuQnBReYqzhG_PK1wX7_YqIAqCgn8Fm796Uu8MMxZLk1QMIABABILlUKANgyYazi8Ck1BCgAa&dblrd=1&sa=L&sig=AOD64_1g-E8yBA7c4_YobhZeDzAqBNHlHQ&sival=AF15MEC&ved=2ahUKEwi',
      )

      expect(unwrapGoogleAds(url)).toBe(
        'https://example.com/wedding?utm_medium=sem&utm_source=google',
      )
    })
  })

  describe('{adclick,googleads}.g.doubleclick.net/aclk', () => {
    it('should extract a percent-encoded target from adclick', () => {
      const url = new URL(
        'http://adclick.g.doubleclick.net/aclk?sa=l&ai=C_yMCER0AVKLcJMSbuATv2oKQDQEAexABILlgKASIAQGQAQDAAQLIAQngAgGoAwGqBFZP0Cq2KTbiVv8g&num=1&sig=AOD64_3HeV2JnMRSAQgcd4ff8U9sakSyvw&client=ca-pub-1234567890123456&adurl=http%3A%2F%2Fexample.com%2Fclick.php%3Fpartnerid%3D8959',
      )

      expect(unwrapGoogleAds(url)).toBe('http://example.com/click.php?partnerid=8959')
    })

    it('should extract a target from googleads followed by Google params', () => {
      const url = new URL(
        'http://googleads.g.doubleclick.net/aclk?sa=L&ai=CmYGyPXWOVdmqOeegigbDuomwCKuJ96YG46P6iPABwI23ARABIPSbyiVghJXshdwdyAEB&num=1&sig=AOD64_2nOvTiz8ilP5x8cJeWXOdOFSUeoA&client=ca-pub-1234567890123456&adurl=http://www.example.com/&nm=51&mb=2',
      )

      expect(unwrapGoogleAds(url)).toBe('http://www.example.com/')
    })
  })

  describe('{ad,adclick.g,googleads.g}.doubleclick.net/pcs/click', () => {
    it('should extract a percent-encoded target from adclick', () => {
      const url = new URL(
        'https://adclick.g.doubleclick.net/pcs/click?xai=AKAOjssxwPx9VuPh4d8Z1Ri5KQx0EuyH3wq&sai=AMfl-YT3Rk1oK8F2HSpL&sig=Cg0ArKJSzKQ2&fbs_aeid=%5Bgw_fbsaeid%5D&urlfix=1&adurl=https%3A%2F%2Fexample.com%2Fsetor-de-ti%2F',
      )

      expect(unwrapGoogleAds(url)).toBe('https://example.com/setor-de-ti/')
    })

    it('should extract a target from googleads followed by Google params', () => {
      const url = new URL(
        'https://googleads.g.doubleclick.net/pcs/click?xai=AKAOjssf6PY9ZFt3JajlFk6RdSdZm4bopgOGlXtVijhs&sai=AMfl-YSMctXxUOa1fyJAWncYN4D1&sig=Cg0ArKJSzJ8v&adurl=https://example.com/&nm=4&nx=691&ny=-601&mb=2&clkt=57',
      )

      expect(unwrapGoogleAds(url)).toBe('https://example.com/')
    })

    it('should extract a target from ad.doubleclick.net', () => {
      const url = new URL(
        'https://ad.doubleclick.net/pcs/click?xai=AKAOjsv-zJrS4-Umk5PI89ZOviGh4pAcs-3oVzoshk8m6jO9Iof3M6p3&sai=AMfl-YSNDNWLPt3F3W2iStEvERg9rUQ5&sig=Cg0ArKJSzOYB01SAygJd&cry=1&urlfix=1&nx=537&ny=51&dim=728x90&adurl=https://example.com/campaign/%3Futm_source%3Ddisplay',
      )

      expect(unwrapGoogleAds(url)).toBe('https://example.com/campaign/?utm_source=display')
    })
  })

  describe('false friends', () => {
    it('should return undefined for an ad request whose url is the host page', () => {
      const url = new URL(
        'https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-1234567890123456&format=468x60_as&output=html&url=https%3A%2F%2Fexample.com%2Fpost%2F&dt=1601712000000',
      )

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })

    it('should return undefined for an aclk without adurl', () => {
      const url = new URL(
        'http://images.google.com/aclk?sa=l&ai=Cu82je6TCS_CTHpSCpATM5LyMDOC3rEHMrMvnDcXJwwUIABABIJOs&sig=AGiWqtyn18rVrWqAoOrLczUKxuStFFn5LA&q=http://www.example.com/cart/',
      )

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })

    it('should return undefined for an aclk with an empty adurl', () => {
      const url = new URL(
        'http://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwiG4OeZyf7QAhUFA2kKHfecBIcYABAA&ohost=www.google.com&sig=AOD64_1g-E8yBA7c4_YobhZeDzAqBNHlHQ&adurl=&q=&nb=1',
      )

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })

    it('should return undefined for an aclk path on another host', () => {
      const url = new URL('https://example.com/aclk?sa=L&adurl=https://example.org/landing/')

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })

    // Constructed: an impression or view beacon with an adurl, on a host that carries clicks.
    it('should return undefined for pagead/adview on google.<TLD>', () => {
      const url = new URL(
        'https://www.google.com/pagead/adview?ai=DChcSEwjv&sig=AOD64_0FMF&adurl=https://example.com/landing/',
      )

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })

    it('should return undefined for pagead/adview on www.googleadservices.com', () => {
      const url = new URL(
        'https://www.googleadservices.com/pagead/adview?ai=C_nMd6&sig=AOD64_3GJ0&adurl=https://example.com/landing/',
      )

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })

    it('should return undefined for pagead/adview on googleads.g.doubleclick.net', () => {
      const url = new URL(
        'https://googleads.g.doubleclick.net/pagead/adview?ai=CmYGyP&sig=AOD64_2nOv&adurl=https://example.com/landing/',
      )

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })

    it('should return undefined for afs/ads on syndicatedsearch.goog', () => {
      const url = new URL(
        'https://syndicatedsearch.goog/afs/ads?client=partner-example&q=landing&adurl=https://example.com/landing/',
      )

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })

    it('should return undefined for pcs/view on adclick.g.doubleclick.net', () => {
      const url = new URL(
        'https://adclick.g.doubleclick.net/pcs/view?xai=AKAOjstJDMpk&sig=Cg0ArKJSzOrV&urlfix=1&adurl=https://example.com/creative.png',
      )

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })
  })

  describe('domains', () => {
    it('should extract a target from a subdomain of doubleclick.net no specimen shows', () => {
      const url = new URL(
        'https://ads.doubleclick.net/aclk?sa=L&adurl=https://example.com/landing/',
      )

      expect(unwrapGoogleAds(url)).toBe('https://example.com/landing/')
    })

    it('should extract a target from a subdomain of googlesyndication.com no specimen shows', () => {
      const url = new URL(
        'https://pagead3.googlesyndication.com/pagead/iclk?sa=L&adurl=https://example.com/landing/',
      )

      expect(unwrapGoogleAds(url)).toBe('https://example.com/landing/')
    })

    it('should extract a target from a subdomain of googleadservices.com no specimen shows', () => {
      const url = new URL(
        'https://imageads.googleadservices.com/pagead/aclk?adurl=https://example.com/landing/',
      )

      expect(unwrapGoogleAds(url)).toBe('https://example.com/landing/')
    })

    it('should return undefined for a lookalike host', () => {
      const url = new URL('https://exampledoubleclick.net/aclk?sa=L&adurl=https://example.org/')

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })

    it('should return undefined for another path on doubleclick.net', () => {
      const url = new URL('https://ad.doubleclick.net/ddm/clk?adurl=https://example.org/')

      expect(unwrapGoogleAds(url)).toBeUndefined()
    })
  })
})
