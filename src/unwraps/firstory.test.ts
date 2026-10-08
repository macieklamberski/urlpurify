import { describe, expect, it } from 'bun:test'
import { unwrapFirstory } from './firstory.js'

describe('unwrapFirstory', () => {
  it('should extract an encoded target from the track prefix', () => {
    const url = new URL(
      'https://m.cdn.firstory.me/track/ckc6eqqt8kc010918u9vibolz/ckjcz4urh60mt0889kp7cdkvm/https%3A%2F%2Fexample.com%2FRecord%2Fckc6eqqt8kc010918u9vibolz%2F1609426748358.m4a',
    )

    expect(unwrapFirstory(url)).toBe(
      'https://example.com/Record/ckc6eqqt8kc010918u9vibolz/1609426748358.m4a',
    )
  })

  it('should keep the query that follows the track prefix', () => {
    const url = new URL(
      'https://m.cdn.firstory.me/track/ck9aa8efs29h20873iiki57fn/ckgnxo9jzy0aa0813xrr7b4ns/https%3A%2F%2Fexample.com%2FRecord%2F1603559076220.m4a?v=1603581332065',
    )

    expect(unwrapFirstory(url)).toBe('https://example.com/Record/1603559076220.m4a?v=1603581332065')
  })

  it('should extract a target from the play endpoint', () => {
    const url = new URL(
      'https://m.cdn.firstory.me/play.mp3?url=https%3A%2F%2Fexample.com%2FRecord%2Fclhhf2kpz01ye01xo2zvy7b6p.mp3%3Fv%3D1683705991008',
    )

    expect(unwrapFirstory(url)).toBe(
      'https://example.com/Record/clhhf2kpz01ye01xo2zvy7b6p.mp3?v=1683705991008',
    )
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://m.cdn.firstory.me/play.mp3?url=https%253A%252F%252Fexample.org%252Fpage',
    )

    expect(unwrapFirstory(url)).toBe('https://example.org/page')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL('https://m.cdn.firstory.me/play.mp3?url=https://example.org/search/a+b')

    expect(unwrapFirstory(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract a target from the play endpoint with another extension', () => {
    const url = new URL(
      'https://m.cdn.firstory.me/play.m4a?url=https%3A%2F%2Fexample.com%2FRecord%2Fepisode.m4a',
    )

    expect(unwrapFirstory(url)).toBe('https://example.com/Record/episode.m4a')
  })

  it('should extract a target from the play endpoint on the cloud host', () => {
    const url = new URL(
      'https://backend.endpoints.firstory-709db.cloud.goog/play.mp3?url=https%3A%2F%2Fexample.com%2FRecord%2Fcktmisn496f1w08423udj4ku6%2F1638182267048.mp3%3Fv%3D1638182274588',
    )

    expect(unwrapFirstory(url)).toBe(
      'https://example.com/Record/cktmisn496f1w08423udj4ku6/1638182267048.mp3?v=1638182274588',
    )
  })

  it('should return undefined for other paths on the cloud host', () => {
    const url = new URL(
      'https://backend.endpoints.firstory-709db.cloud.goog/api/play?url=https%3A%2F%2Fexample.com%2FRecord%2Fepisode.mp3',
    )

    expect(unwrapFirstory(url)).toBeUndefined()
  })

  it('should return undefined for the track prefix on the cloud host', () => {
    const url = new URL(
      'https://backend.endpoints.firstory-709db.cloud.goog/track/ckc6eqqt8kc010918u9vibolz/ckjcz4urh60mt0889kp7cdkvm/https%3A%2F%2Fexample.com%2FRecord%2F1609426748358.m4a',
    )

    expect(unwrapFirstory(url)).toBeUndefined()
  })

  it('should add https to a scheme-less target from the short prefix', () => {
    const url = new URL(
      'https://track.fstry.me/p/psnx2924/example.com/rssf/c4f7213b-84ea-41d8-b9b4-e9a9d6e47730/feedurl/27200648-87dc-4de4-bf8a-43f6e9304253/rssFileVip.mp3?timestamp=1763827691662',
    )

    expect(unwrapFirstory(url)).toBe(
      'https://example.com/rssf/c4f7213b-84ea-41d8-b9b4-e9a9d6e47730/feedurl/27200648-87dc-4de4-bf8a-43f6e9304253/rssFileVip.mp3?timestamp=1763827691662',
    )
  })

  it('should add https to a scheme-less target from the short prefix on http', () => {
    const url = new URL('http://track.fstry.me/p/psnx2924/example.com/rssFileVip.mp3')

    expect(unwrapFirstory(url)).toBe('https://example.com/rssFileVip.mp3')
  })

  it('should keep the scheme of a target from the short prefix', () => {
    const url = new URL(
      'https://track.fstry.me/p/dmunc74c/http://example.com/stream/2339519129-juicybaskets-278a.mp3',
    )

    expect(unwrapFirstory(url)).toBe('http://example.com/stream/2339519129-juicybaskets-278a.mp3')
  })

  it('should return undefined for the short prefix without a target', () => {
    const url = new URL('https://track.fstry.me/p/psnx2924/')

    expect(unwrapFirstory(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the short prefix host', () => {
    const url = new URL('https://track.fstry.me/psnx2924/example.com/rssFileVip.mp3')

    expect(unwrapFirstory(url)).toBeUndefined()
  })

  it('should return undefined for the short prefix on another Firstory host', () => {
    const url = new URL('https://m.cdn.firstory.me/p/psnx2924/example.com/rssFileVip.mp3')

    expect(unwrapFirstory(url)).toBeUndefined()
  })

  it('should return undefined for the play endpoint without a url', () => {
    const url = new URL('https://m.cdn.firstory.me/play.mp3')

    expect(unwrapFirstory(url)).toBeUndefined()
  })

  it('should return undefined for a target cut short inside an escape', () => {
    const url = new URL(
      'https://m.cdn.firstory.me/track/ckc6eqqt8kc010918u9vibolz/ckjcz4urh60mt0889kp7cdkvm/https%3A%2F%2Fexample.com%2',
    )

    expect(unwrapFirstory(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://m.cdn.firstory.me/track/ckc6eqqt8kc010918u9vibolz')

    expect(unwrapFirstory(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/play.mp3?url=https%3A%2F%2Fexample.org%2Fepisode.mp3')

    expect(unwrapFirstory(url)).toBeUndefined()
  })

  it('should return undefined for the short prefix below another path', () => {
    const url = new URL('https://track.fstry.me/x/p/psnx2924/example.com/rssFileVip.mp3')

    expect(unwrapFirstory(url)).toBeUndefined()
  })
})
