import { describe, expect, it } from 'bun:test'
import { unwrapBlubrry } from './blubrry.js'

describe('unwrapBlubrry', () => {
  it('should extract a target without a scheme after the show', () => {
    const url = new URL(
      'https://media.blubrry.com/svegot/example.com/v2/episodes/18884399/download.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/v2/episodes/18884399/download.mp3')
  })

  it('should extract a target with a scheme after the show', () => {
    const url = new URL(
      'http://media.blubrry.com/podcast_horoscopo/http://example.com/16150583.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('http://example.com/16150583.mp3')
  })

  it('should extract a target after the p segment', () => {
    const url = new URL(
      'http://media.blubrry.com/socialmediachurch/p/example.com/wp-content/uploads/2014/07/ep93.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('http://example.com/wp-content/uploads/2014/07/ep93.mp3')
  })

  it('should extract a target after the s segment', () => {
    const url = new URL(
      'https://media.blubrry.com/the_rpg_academy/s/example.com/wp-content/uploads/2020/01/FM-137.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/wp-content/uploads/2020/01/FM-137.mp3')
  })

  it('should extract a target after the b segment', () => {
    const url = new URL(
      'http://media.blubrry.com/truth_about_fx/b/example.com/truth_about_fx/CP_-_Alex.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('http://example.com/truth_about_fx/CP_-_Alex.mp3')
  })

  it('should extract a target with a scheme after the s segment', () => {
    const url = new URL(
      'https://media.blubrry.com/porquepodcast/s/https://example.com/v2/episodes/51973655/download.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/v2/episodes/51973655/download.mp3')
  })

  it('should skip an empty segment after the show', () => {
    const url = new URL(
      'https://media.blubrry.com/lead_your_life//example.com/lead-your-life-series/lylseries8.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/lead-your-life-series/lylseries8.mp3')
  })

  it('should keep the target query string', () => {
    const url = new URL(
      'https://media.blubrry.com/svegot/example.com/episode.mp3?updated=1700000000',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/episode.mp3?updated=1700000000')
  })

  it('should peel a Blubrry prefix that wraps another', () => {
    const url = new URL(
      'https://media.blubrry.com/svegot/media.blubrry.com/svegot2/example.com/episode.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://media.blubrry.com/svegot2/example.com/episode.mp3')
  })

  it('should extract a file on Blubrry storage', () => {
    const url = new URL(
      'https://media.blubrry.com/leadership/content.blubrry.com/leadership/LTLEp46_PepedelRio.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://content.blubrry.com/leadership/LTLEp46_PepedelRio.mp3')
  })

  it('should extract a target without a scheme on RawVoice', () => {
    const url = new URL('http://media.rawvoice.com/uie_podcasts/www.example.com/BSAL/BSAL084.mp3')

    expect(unwrapBlubrry(url)).toBe('http://www.example.com/BSAL/BSAL084.mp3')
  })

  it('should extract a target without a scheme on RawVoice over https', () => {
    const url = new URL(
      'https://media.rawvoice.com/lse_philosophy/richmedia.example.ac.uk/philosophy/20221702.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://richmedia.example.ac.uk/philosophy/20221702.mp3')
  })

  it('should extract a target after the p segment on RawVoice', () => {
    const url = new URL(
      'http://media.rawvoice.com/uie_podcasts/p/asset.example.com/BSAL/BSAL249SpoolCast.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('http://asset.example.com/BSAL/BSAL249SpoolCast.mp3')
  })

  it('should extract a target after the s segment on RawVoice', () => {
    const url = new URL(
      'http://media.rawvoice.com/joy_driving/s/example.org.au/fridaydrive/181012-ComingBackOutBall.mp3?_=1',
    )

    expect(unwrapBlubrry(url)).toBe(
      'http://example.org.au/fridaydrive/181012-ComingBackOutBall.mp3?_=1',
    )
  })

  it('should extract a target with a scheme on RawVoice', () => {
    const url = new URL(
      'http://media.rawvoice.com/arewealone/https://example.com/arewealone/BiPiSci15-03-16.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/arewealone/BiPiSci15-03-16.mp3')
  })

  it('should extract a target without a scheme on TechPodcasts', () => {
    const url = new URL(
      'http://media.techpodcasts.com/media/cdn.example.com/media/2011/03/btm_e44.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('http://cdn.example.com/media/2011/03/btm_e44.mp3')
  })

  it('should extract a Blubrry prefix without a scheme on TechPodcasts over https', () => {
    const url = new URL(
      'https://media.techpodcasts.com/plughitzlive/media.blubrry.com/tpnlive/content.blubrry.com/tpnlive/CES2016-F5-Jamstik.mp4',
    )

    expect(unwrapBlubrry(url)).toBe(
      'https://media.blubrry.com/tpnlive/content.blubrry.com/tpnlive/CES2016-F5-Jamstik.mp4',
    )
  })

  it('should extract a target after the p segment on TechPodcasts', () => {
    const url = new URL(
      'http://media.techpodcasts.com/loutrekshow/p/example.org.uk/battlebridge/tbb-s7e09.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('http://example.org.uk/battlebridge/tbb-s7e09.mp3')
  })

  it('should extract a target with a scheme on TechPodcasts', () => {
    const url = new URL(
      'http://media.techpodcasts.com/myamateurradio/http://example.com/episodes/parpv48_4.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('http://example.com/episodes/parpv48_4.mp3')
  })

  it('should return undefined when no host follows the show on RawVoice', () => {
    const url = new URL('http://media.rawvoice.com/uie_podcasts/BSAL/BSAL084.mp3')

    expect(unwrapBlubrry(url)).toBeUndefined()
  })

  it('should return undefined when no host follows the show', () => {
    const url = new URL('https://media.blubrry.com/svegot/episodes/download.mp3')

    expect(unwrapBlubrry(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/svegot/example.org/episode.mp3')

    expect(unwrapBlubrry(url)).toBeUndefined()
  })
})
