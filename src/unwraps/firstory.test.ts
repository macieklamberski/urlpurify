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

  it('should extract a target from the play endpoint with another extension', () => {
    const url = new URL(
      'https://m.cdn.firstory.me/play.m4a?url=https%3A%2F%2Fexample.com%2FRecord%2Fepisode.m4a',
    )

    expect(unwrapFirstory(url)).toBe('https://example.com/Record/episode.m4a')
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
})
