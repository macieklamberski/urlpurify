import { describe, expect, it } from 'bun:test'
import { unwrapFiveByFive } from './fiveByFive.js'

describe('unwrapFiveByFive', () => {
  it('should extract the target from the fdlyr.co show prefix', () => {
    const value = new URL(
      'http://fdlyr.co/d/webahead/cdn.5by5.tv/audio/broadcasts/webahead/2015/webahead-093.mp3',
    )
    const expected = 'http://cdn.5by5.tv/audio/broadcasts/webahead/2015/webahead-093.mp3'

    expect(unwrapFiveByFive(value)).toBe(expected)
  })

  it('should keep the fragment of the target', () => {
    const value = new URL(
      'http://fdlyr.co/d/criticalpath/cdn.5by5.tv/audio/broadcasts/criticalpath/2015/criticalpath-146.mp3#t=0',
    )
    const expected =
      'http://cdn.5by5.tv/audio/broadcasts/criticalpath/2015/criticalpath-146.mp3#t=0'

    expect(unwrapFiveByFive(value)).toBe(expected)
  })

  it('should extract the target from the d.5by5.net redirect prefix', () => {
    const value = new URL(
      'http://d.5by5.net/redirect.mp3/cdn.5by5.tv/audio/broadcasts/tcn/2012/tcn-070.mp3',
    )
    const expected = 'http://cdn.5by5.tv/audio/broadcasts/tcn/2012/tcn-070.mp3'

    expect(unwrapFiveByFive(value)).toBe(expected)
  })

  it('should extract the target from the d.ahoy.co redirect prefix', () => {
    const value = new URL(
      'http://d.ahoy.co/redirect.mp3/fly.5by5.tv/audio/broadcasts/mpu/2012/mpu-099.mp3',
    )
    const expected = 'http://fly.5by5.tv/audio/broadcasts/mpu/2012/mpu-099.mp3'

    expect(unwrapFiveByFive(value)).toBe(expected)
  })

  it('should extract the target from the d.ahoy.co pts redirect prefix', () => {
    const value = new URL(
      'http://d.ahoy.co/pts/redirect.mp3/media.5by5.tv/audio/broadcasts/afterdark/2012/afterdark-199.mp3',
    )
    const expected = 'http://media.5by5.tv/audio/broadcasts/afterdark/2012/afterdark-199.mp3'

    expect(unwrapFiveByFive(value)).toBe(expected)
  })

  it('should keep the scheme of a target that has one', () => {
    const value = new URL('http://d.5by5.net/redirect.mp3/https://example.com/episode.mp3')
    const expected = 'https://example.com/episode.mp3'

    expect(unwrapFiveByFive(value)).toBe(expected)
  })

  it('should return undefined when the show prefix has no target', () => {
    const value = new URL('http://fdlyr.co/d/webahead/')

    expect(unwrapFiveByFive(value)).toBeUndefined()
  })

  it('should return undefined for fdlyr.co without a show segment', () => {
    const value = new URL('http://fdlyr.co/d/cdn.5by5.tv')

    expect(unwrapFiveByFive(value)).toBeUndefined()
  })

  it('should return undefined for other paths on fdlyr.co', () => {
    const value = new URL('http://fdlyr.co/redirect.mp3/cdn.5by5.tv/audio/a.mp3')

    expect(unwrapFiveByFive(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the redirect hosts', () => {
    const value = new URL('http://d.5by5.net/d/webahead/cdn.5by5.tv/audio/a.mp3')

    expect(unwrapFiveByFive(value)).toBeUndefined()
  })

  it('should return undefined when the redirect prefix is not at the start of the path', () => {
    const value = new URL('http://d.5by5.net/stats/redirect.mp3/cdn.5by5.tv/audio/a.mp3')

    expect(unwrapFiveByFive(value)).toBeUndefined()
  })

  it('should return undefined for the redirect prefix on other hosts', () => {
    const value = new URL('http://dts.podtrac.com/redirect.mp3/cdn.5by5.tv/audio/a.mp3')

    expect(unwrapFiveByFive(value)).toBeUndefined()
  })

  it('should return undefined for the show prefix on other hosts', () => {
    const value = new URL('http://example.com/d/webahead/cdn.5by5.tv/audio/a.mp3')

    expect(unwrapFiveByFive(value)).toBeUndefined()
  })

  it('should return undefined for the show prefix below another path', () => {
    const value = new URL('http://fdlyr.co/x/d/webahead/cdn.5by5.tv/audio/a.mp3')

    expect(unwrapFiveByFive(value)).toBeUndefined()
  })

  it('should read the show prefix on the www. host', () => {
    const value = new URL('https://www.fdlyr.co/d/show/example.com/a.mp3')
    const expected = 'http://example.com/a.mp3'

    expect(unwrapFiveByFive(value)).toBe(expected)
  })
})
