import { describe, expect, it } from 'bun:test'
import { unwrapSubscribeRu } from './subscribeRu.js'

describe('unwrapSubscribeRu', () => {
  it('should extract the target of a newsletter link', () => {
    const url = new URL(
      'http://redirect.subscribe.ru/funny.anet.anec,1042/20120215003154/77328=77037=74495=32251=77454/m19604482/-/example.net/best/pic/picphoto3062340116s.html',
    )

    expect(unwrapSubscribeRu(url)).toBe('http://example.net/best/pic/picphoto3062340116s.html')
  })

  it('should extract the target of a link with no newsletter', () => {
    const url = new URL('http://redirect.subscribe.ru/_/-/www.example.org/topic/3/page/39/')

    expect(unwrapSubscribeRu(url)).toBe('http://www.example.org/topic/3/page/39/')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'http://redirect.subscribe.ru/rest.esoteric.stelanacelit,54254/20091006073354/15013=14975=t13=15008=14979/m8846352/-/example.ru/?partner=00243#top',
    )

    expect(unwrapSubscribeRu(url)).toBe('http://example.ru/?partner=00243#top')
  })

  it('should return undefined for a target that keeps its scheme', () => {
    const url = new URL('http://redirect.subscribe.ru/_/-/https://www.example.org/topic/3/')

    expect(unwrapSubscribeRu(url)).toBeUndefined()
  })

  it('should return undefined for a target with no dot in its first segment', () => {
    const url = new URL('http://redirect.subscribe.ru/_/-/archive/topic/3/')

    expect(unwrapSubscribeRu(url)).toBeUndefined()
  })

  it('should return undefined for a newsletter link with a partial timestamp', () => {
    const url = new URL(
      'http://redirect.subscribe.ru/funny.anet.anec,1042/20120215/77328=77037/m19604482/-/example.net/best/',
    )

    expect(unwrapSubscribeRu(url)).toBeUndefined()
  })

  it('should return undefined for the target separator without a prefix', () => {
    const url = new URL('http://redirect.subscribe.ru/-/www.example.org/topic/3/')

    expect(unwrapSubscribeRu(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('http://subscribe.ru/_/-/www.example.org/topic/3/')

    expect(unwrapSubscribeRu(url)).toBeUndefined()
  })

  it('should return undefined for a newsletter link with no issue number', () => {
    const url = new URL(
      'http://redirect.subscribe.ru/funny.anet.anec/20120215003154/77328=77037/m19604482/-/example.net/best/',
    )

    expect(unwrapSubscribeRu(url)).toBeUndefined()
  })

  it('should return undefined for a newsletter link with no message number', () => {
    const url = new URL(
      'http://redirect.subscribe.ru/funny.anet.anec,1042/20120215003154/77328=77037/x19604482/-/example.net/best/',
    )

    expect(unwrapSubscribeRu(url)).toBeUndefined()
  })
})
