import { describe, expect, it } from 'bun:test'
import { unwrapTumblrShare } from './tumblrShare.js'

describe('unwrapTumblrShare', () => {
  it('should extract the target from share with u', () => {
    const value = new URL(
      'https://www.tumblr.com/share?v=3&u=https%3A%2F%2Fblog.example.com%2F2026%2F06%2F28%2Fszarajevoi_merenylet_ebbol_a_nezopontbol_meg_sosem_latta%3Futm_source%3Dbloghu_rss&t=Szarajev%C3%B3i%20mer%C3%A9nylet',
    )
    const expected =
      'https://blog.example.com/2026/06/28/szarajevoi_merenylet_ebbol_a_nezopontbol_meg_sosem_latta?utm_source=bloghu_rss'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should extract the target from share on the bare host', () => {
    const value = new URL(
      'https://tumblr.com/share?s=&v=3&t=New%20Super%20Rivals%20page%21&u=https%3A%2F%2Fexample.com%2Fcomic%2Fnew-super-rivals-page-337%2F',
    )
    const expected = 'https://example.com/comic/new-super-rivals-page-337/'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should extract an unencoded target from share with u', () => {
    const value = new URL(
      'http://www.tumblr.com/share?v=3&u=https://www.example.com/laugavegur-preparation/&t=The%20Laugavegur%20Hiking%20Trail',
    )
    const expected = 'https://www.example.com/laugavegur-preparation/'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should extract the target from share with canonicalUrl', () => {
    const value = new URL(
      'https://www.tumblr.com/share?canonicalUrl=http://example.com/this-bodybuilder-fat-shamed-fellow-gym-goer-to-her-instagram-fans/&title=This',
    )
    const expected =
      'http://example.com/this-bodybuilder-fat-shamed-fellow-gym-goer-to-her-instagram-fans/'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should extract the target from share/link', () => {
    const value = new URL(
      'https://www.tumblr.com/share/link?url=https%3A%2F%2Fexample.com%2Fblog%2Fandalucia-consolida-su-liderazgo-en-ciberseguridad%2F&name=Andaluc%C3%ADa%20consolida&description=Andaluc%C3%ADa',
    )
    const expected = 'https://example.com/blog/andalucia-consolida-su-liderazgo-en-ciberseguridad/'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should extract the target from share/link with a trailing slash', () => {
    const value = new URL(
      'https://www.tumblr.com/share/link/?url=http%3A%2F%2Fexample.com%2Fsites-a-decouvrir%2F&name=Sites%20%C3%A0%20d%C3%A9couvrir',
    )
    const expected = 'http://example.com/sites-a-decouvrir/'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should extract the target from the share tool', () => {
    const value = new URL(
      'https://tumblr.com/widgets/share/tool?canonicalUrl=https%3A%2F%2Fwww.example.com%2Ffeed',
    )
    const expected = 'https://www.example.com/feed'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should read canonicalUrl over the photo content in the share tool', () => {
    const value = new URL(
      'https://www.tumblr.com/widgets/share/tool?canonicalUrl=http%3A%2F%2Fexample.com%2Ftexts%2Fr%2Freaction%2F&posttype=photo&content=http%3A%2F%2Fexample.com%2Ftexts%2Fr%2Freaction%2Fimages%2Ftrump1370.jpg&caption=After%20the%20Election',
    )
    const expected = 'http://example.com/texts/r/reaction/'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should extract the target from url when canonicalUrl is empty in the share tool', () => {
    const value = new URL(
      'https://www.tumblr.com/widgets/share/tool?shareSource=legacy&canonicalUrl=&posttype=link&url=https%3A%2F%2Fexample.com%2Fnoticias%2Fasteroide-que-se-parece-com-113654441.html&title=Asteroide',
    )
    const expected = 'https://example.com/noticias/asteroide-que-se-parece-com-113654441.html'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should read canonicalUrl over url in the share tool', () => {
    const value = new URL(
      'https://www.tumblr.com/widgets/share/tool?shareSource=legacy&canonicalUrl=https%3A%2F%2Fexample.com%2Fcanonical&posttype=link&url=https%3A%2F%2Fexample.com%2Fother',
    )
    const expected = 'https://example.com/canonical'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should read u over canonicalUrl in share', () => {
    const value = new URL(
      'https://www.tumblr.com/share?v=3&u=https%3A%2F%2Fexample.com%2Fu&canonicalUrl=https%3A%2F%2Fexample.com%2Fcanonical',
    )
    const expected = 'https://example.com/u'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://www.tumblr.com/share?v=3&u=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://www.tumblr.com/Share/Link?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should match the share path in any case', () => {
    const value = new URL('https://www.tumblr.com/Share?u=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should match the share tool path in any case', () => {
    const value = new URL(
      'https://www.tumblr.com/Widgets/Share/Tool?canonicalUrl=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapTumblrShare(value)).toBe(expected)
  })

  it('should return undefined when the u param is empty', () => {
    const value = new URL('https://www.tumblr.com/share?v=3&u=&t=Title')

    expect(unwrapTumblrShare(value)).toBeUndefined()
  })

  it('should return undefined for the photo share', () => {
    // The u= is constructed: no photo share link in the walk carries it.
    const value = new URL(
      'http://www.tumblr.com/share/photo?source=http%3A%2F%2Fexample.com%2Fimages%2Fpreview1500.jpg&caption=Why&u=https%3A%2F%2Fexample.com%2Fpost&click_thru=http%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapTumblrShare(value)).toBeUndefined()
  })

  it('should return undefined for the share tool preview', () => {
    const value = new URL(
      'https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl&url=http%3A%2F%2Fexample.com%2F2018%2Ffilm%2Ffestivals%2Fsundance-film-festival-awards-2018-1202679213%2F&posttype=link&title=Sundance',
    )

    expect(unwrapTumblrShare(value)).toBeUndefined()
  })

  it('should return undefined for share under another path', () => {
    const value = new URL('https://www.tumblr.com/example/share?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapTumblrShare(value)).toBeUndefined()
  })

  it('should return undefined for share/link under another path', () => {
    const value = new URL(
      'https://www.tumblr.com/example/share/link?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapTumblrShare(value)).toBeUndefined()
  })

  it('should return undefined for the share tool under another path', () => {
    const value = new URL(
      'https://www.tumblr.com/example/widgets/share/tool?canonicalUrl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapTumblrShare(value)).toBeUndefined()
  })

  it('should return undefined for a path below share/link', () => {
    const value = new URL(
      'https://www.tumblr.com/share/link/example?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapTumblrShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/share/link?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapTumblrShare(value)).toBeUndefined()
  })
})
