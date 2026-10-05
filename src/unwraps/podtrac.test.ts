import { describe, expect, it } from 'bun:test'
import { unwrapPodtrac } from './podtrac.js'

describe('unwrapPodtrac', () => {
  it('should extract a target without a scheme from the dts prefix', () => {
    const url = new URL(
      'https://dts.podtrac.com/redirect.mp3/example.com/download/episode/71034392/50028231.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('https://example.com/download/episode/71034392/50028231.mp3')
  })

  it('should extract a target with a scheme from the dts prefix', () => {
    const url = new URL(
      'https://dts.podtrac.com/redirect.mp3/http://example.com/podcasts/lte-V32.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('http://example.com/podcasts/lte-V32.mp3')
  })

  it('should extract a target from the dts prefix under /pts/', () => {
    const url = new URL(
      'https://dts.podtrac.com/pts/redirect.mp3/example.com/filmjunk/gamejunk274.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('https://example.com/filmjunk/gamejunk274.mp3')
  })

  it('should extract a target from the www prefix', () => {
    const url = new URL(
      'https://www.podtrac.com/pts/redirect.mp3/example.com/broadway/20260622-br-classnotes.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('https://example.com/broadway/20260622-br-classnotes.mp3')
  })

  it('should keep the target query string from the bare host prefix', () => {
    const url = new URL(
      'https://podtrac.com/pts/redirect.mp3/example.com/d/clips/c2c2dd32/audio.mp3?utm_source=Podcast&in_playlist=b676c68a',
    )

    expect(unwrapPodtrac(url)).toBe(
      'https://example.com/d/clips/c2c2dd32/audio.mp3?utm_source=Podcast&in_playlist=b676c68a',
    )
  })

  it('should extract a target from the query of the www prefix', () => {
    const url = new URL(
      'http://www.podtrac.com/pts/redirect.mp3?http://example.com/podcast/TREKSF_141.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('http://example.com/podcast/TREKSF_141.mp3')
  })

  it('should extract a target from the query after a trailing slash', () => {
    const url = new URL(
      'http://www.podtrac.com/pts/redirect.mp3/?http://example.com/download/aaapodcast_episode236.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('http://example.com/download/aaapodcast_episode236.mp3')
  })

  it('should skip empty segments after the prefix', () => {
    const url = new URL(
      'https://dts.podtrac.com/redirect.mp3///example.com/podcast_audio/JDD_2020_Dec.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('https://example.com/podcast_audio/JDD_2020_Dec.mp3')
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL(
      'https://dts.podtrac.com/redirect.mp3/chrt.fm/track/29E4C9/example.com/Galaxy_108.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('https://chrt.fm/track/29E4C9/example.com/Galaxy_108.mp3')
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://dts.podtrac.com/redirect.mp3/')

    expect(unwrapPodtrac(url)).toBeUndefined()
  })

  it('should extract a target with a scheme when the slash after the extension is missing', () => {
    const url = new URL(
      'https://dts.podtrac.com/redirect.mp3https://example.com/dd/7c/2c/4b98cd420f.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('https://example.com/dd/7c/2c/4b98cd420f.mp3')
  })

  it('should extract a single-slash target when the slash after the www extension is missing', () => {
    const url = new URL(
      'http://www.podtrac.com/pts/redirect.mp3https:/example.com/episodes/Hopinions144.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('https:/example.com/episodes/Hopinions144.mp3')
  })

  it('should extract a target after a stray dot following the extension', () => {
    const url = new URL(
      'http://www.podtrac.com/pts/redirect.mp3./example.com/stream/2329399343-interview.mp3',
    )

    expect(unwrapPodtrac(url)).toBe('https://example.com/stream/2329399343-interview.mp3')
  })

  it('should extract a target after the show segment on the play host', () => {
    const url = new URL(
      'http://play.podtrac.com/APM-SplendidTable/example.com/itunes/d/podcast/splendidtable_20161028_64.mp3',
    )

    expect(unwrapPodtrac(url)).toBe(
      'https://example.com/itunes/d/podcast/splendidtable_20161028_64.mp3',
    )
  })

  it('should return undefined for a query that holds no http url', () => {
    const url = new URL('http://www.podtrac.com/pts/redirect.mp3?ftp://example.com/episode.mp3')

    expect(unwrapPodtrac(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the hosts', () => {
    const url = new URL(
      'http://www.podtrac.com/PodtracPlayer/podtracplayer.aspx?podcast=http://example.com/podcast',
    )

    expect(unwrapPodtrac(url)).toBeUndefined()
  })

  it('should return undefined for the redirect path without /pts/ on the www host', () => {
    const url = new URL('https://www.podtrac.com/redirect.mp3/example.com/episode.mp3')

    expect(unwrapPodtrac(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/redirect.mp3/example.org/episode.mp3')

    expect(unwrapPodtrac(url)).toBeUndefined()
  })
})
