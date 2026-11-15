import { describe, expect, it } from 'bun:test'
import { unwrapGenericCarrier } from './genericCarrier.js'

describe('unwrapGenericCarrier', () => {
  describe('url carrier', () => {
    it('should extract a raw target', () => {
      const value = new URL(
        'https://messaging.example.com/redirect?tag=K-AAAA-AAAA-AAAA&message=0&url=https://podcasts.example.org/pod/show/episodes/Lena-Poetry-e2mlq52',
      )
      const expected = 'https://podcasts.example.org/pod/show/episodes/Lena-Poetry-e2mlq52'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })

    it('should extract an escaped target', () => {
      const value = new URL(
        'http://app.example.com/redir.do?source=1&feed=6&language=en&listingId=15358533&type=VIDEO&url=https%3A%2F%2Fvideo.example.org%2Fwatch%3Fv%3DGDzjrrQwSM0',
      )
      const expected = 'https://video.example.org/watch?v=GDzjrrQwSM0'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })

    it('should extract a twice-escaped target', () => {
      const value = new URL(
        'https://www.example.com/out?url=https%253A%252F%252Fwww.example.org%252Fpost%252F',
      )
      const expected = 'https://www.example.org/post/'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })

    it('should match the carrier name in any case', () => {
      const value = new URL('https://www.example.com/go?URL=https://www.example.org/post/')
      const expected = 'https://www.example.org/post/'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })

    it('should cut a target without a query of its own at the next param', () => {
      const value = new URL(
        'https://bitly.example.com/a/warning?hash=2wI9AMs&url=http://www.example.org/obi/jess.htm&ref=feed',
      )
      const expected = 'http://www.example.org/obi/jess.htm'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })

    it('should cut an escaped target with a literal query of its own at the next param', () => {
      const value = new URL(
        'https://player.example.com/player/?url=https%3A//api.example.org/tracks/316457900?secret_token=s-KJKTw&color=%23ff5500&auto_play=false',
      )
      const expected = 'https://api.example.org/tracks/316457900?secret_token=s-KJKTw'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('feedurl carrier', () => {
    it('should extract a raw target', () => {
      const value = new URL(
        'https://wire.example.com/read-partners-feed?feedurl=https://news.example.org/feed/',
      )
      const expected = 'https://news.example.org/feed/'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })

    it('should extract an escaped target', () => {
      const value = new URL(
        'https://www.example.com/apiv2/feed?theme=dark&feedurl=https%3A%2F%2Fsocial.example.org%2Fusers%2Fweather%2Foutbox%3Fpage%3Dtrue&size=80',
      )
      const expected = 'https://social.example.org/users/weather/outbox?page=true'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('moduleurl carrier', () => {
    it('should extract a target', () => {
      const value = new URL(
        'https://portal.example.com/add?moduleurl=https%3A%2F%2Fwww.example.org%2Frss.xml',
      )
      const expected = 'https://www.example.org/rss.xml'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('feed.url carrier', () => {
    it('should extract a target', () => {
      const value = new URL(
        'https://reader.example.com/subscribe?feed.url=https%3A%2F%2Fwww.example.org%2Ffeed',
      )
      const expected = 'https://www.example.org/feed'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('.url carrier', () => {
    it('should extract a target', () => {
      const value = new URL('https://reader.example.com/add?id=7&.url=https://www.example.org/feed')
      const expected = 'https://www.example.org/feed'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('link carrier', () => {
    it('should extract a target', () => {
      const value = new URL(
        'https://go.example.com/app/playmusic?ibi=com.example.PlayMusic&isi=691797987&link=https://music.example.org/m/Ixbwk7urvkmuxc42z7nf32jfgx4',
      )
      const expected = 'https://music.example.org/m/Ixbwk7urvkmuxc42z7nf32jfgx4'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('redirect carrier', () => {
    it('should extract a target', () => {
      const value = new URL(
        'https://app.example.com/api/v1/messages/tracking/click/5337d7943b361f18edf62dc3/59b0e1ad58ac9c524d689385/?redirect=https%3A%2F%2Fconsultations.example.org%2F',
      )
      const expected = 'https://consultations.example.org/'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('to carrier', () => {
    it('should extract a target', () => {
      const value = new URL(
        'https://social.example.com/away.php?utf=1&to=https%3A%2F%2Fpodcast.example.org%2F',
      )
      const expected = 'https://podcast.example.org/'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('go carrier', () => {
    it('should extract a target', () => {
      const value = new URL(
        'https://www.example.com/files/links.php?go=https://clinic.example.org/surgery-turkey',
      )
      const expected = 'https://clinic.example.org/surgery-turkey'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('goto carrier', () => {
    it('should extract a target', () => {
      const value = new URL(
        'https://www.example.com/bitrix/redirect.php?event1=click_to_call&event2=&event3=&goto=https://blog.example.org/2026/02/post.html',
      )
      const expected = 'https://blog.example.org/2026/02/post.html'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('out carrier', () => {
    it('should extract a target', () => {
      const value = new URL(
        'https://my.example.com/username/link/link.php?out=https://www.example.org/',
      )
      const expected = 'https://www.example.org/'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  describe('raw target with a query of its own', () => {
    it('should read the target to the end', () => {
      const value = new URL(
        'https://www.example.com/external/?url=https://www.example.org/feed?page=1&tag=news',
      )
      const expected = 'https://www.example.org/feed?page=1&tag=news'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })

    it('should keep the fragment', () => {
      const value = new URL(
        'https://www.example.com/external/?url=https://www.example.org/post?id=4&lang=en#comments',
      )
      const expected = 'https://www.example.org/post?id=4&lang=en#comments'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })

    it('should take the first carrier when a second sits inside the target', () => {
      const value = new URL(
        'https://www.example.com/go?url=https://a.example.org/x?feedurl=https://b.example.org/feed',
      )
      const expected = 'https://a.example.org/x?feedurl=https://b.example.org/feed'

      expect(unwrapGenericCarrier(value)).toBe(expected)
    })
  })

  it('should skip a carrier without an http target for a later one', () => {
    const value = new URL(
      'https://www.example.com/feed?url=www.example.com&feedurl=https://www.example.org/feed',
    )
    const expected = 'https://www.example.org/feed'

    expect(unwrapGenericCarrier(value)).toBe(expected)
  })

  it('should return undefined for a target without a scheme', () => {
    const value = new URL('https://search.example.com/results?url=www.example.org/post/')

    expect(unwrapGenericCarrier(value)).toBeUndefined()
  })

  it('should return undefined for a protocol-relative target', () => {
    const value = new URL('https://www.example.com/go?url=//www.example.org/post/')

    expect(unwrapGenericCarrier(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL('https://www.example.com/go?url=ftp://files.example.org/archive.zip')

    expect(unwrapGenericCarrier(value)).toBeUndefined()
  })

  it('should return undefined for an empty carrier', () => {
    const value = new URL('https://www.example.com/go?url=&feedurl=')

    expect(unwrapGenericCarrier(value)).toBeUndefined()
  })

  it('should return undefined for a url in a free-text field', () => {
    const value = new URL(
      'https://chat.example.com/send?text=https%3A%2F%2Fwww.example.org%2Fpost%2F',
    )

    expect(unwrapGenericCarrier(value)).toBeUndefined()
  })

  it('should return undefined for an embed origin', () => {
    const value = new URL(
      'https://video.example.com/embed/GbQ6tzh15lQ?origin=https://www.example.org&wmode=opaque',
    )

    expect(unwrapGenericCarrier(value)).toBeUndefined()
  })

  it('should return undefined for a return url', () => {
    const value = new URL(
      'http://www.example.com/Legal/ChangeCulture?lang=en-US&returnUrl=https://www.example.org/post/',
    )

    expect(unwrapGenericCarrier(value)).toBeUndefined()
  })

  it('should return undefined for a carrier name inside another param name', () => {
    const value = new URL(
      'https://www.example.com/apiv2/feed?userurl=https%3A%2F%2Fsocial.example.org%2Fusers%2Fweather',
    )

    expect(unwrapGenericCarrier(value)).toBeUndefined()
  })

  it('should scan a long query in linear time', () => {
    const value = new URL(`https://www.example.com/go?${'url=x&'.repeat(40000)}`)
    const start = performance.now()

    unwrapGenericCarrier(value)

    expect(performance.now() - start).toBeLessThan(1000)
  })
})
