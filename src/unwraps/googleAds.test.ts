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
  })
})
