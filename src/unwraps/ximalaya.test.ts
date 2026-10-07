import { describe, expect, it } from 'bun:test'
import { unwrapXimalaya } from './ximalaya.js'

describe('unwrapXimalaya', () => {
  it('should extract the target', () => {
    const url = new URL(
      'https://jt.ximalaya.com//GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&album_id=8685104&track_id=597681973&uid=5669686&jt=https://aod.cos.tx.xmcdn.com/storages/738b-audiofreehighqps/DB/4C/GKwRIJEHdJdaAK_G9QHh-p5O.m4a',
    )

    expect(unwrapXimalaya(url)).toBe(
      'https://aod.cos.tx.xmcdn.com/storages/738b-audiofreehighqps/DB/4C/GKwRIJEHdJdaAK_G9QHh-p5O.m4a',
    )
  })

  it('should keep the http scheme of the target', () => {
    const url = new URL(
      'https://jt.ximalaya.com//wKgJTVpAl6vi_pNgAFQ2YKM07dk889.m4a?channel=rss&album_id=8548637&track_id=64282973&uid=8914100&jt=http://audio.xmcdn.com/group36/M0B/05/EB/wKgJTVpAl6vi_pNgAFQ2YKM07dk889.m4a',
    )

    expect(unwrapXimalaya(url)).toBe(
      'http://audio.xmcdn.com/group36/M0B/05/EB/wKgJTVpAl6vi_pNgAFQ2YKM07dk889.m4a',
    )
  })

  it('should return undefined for a target outside xmcdn.com', () => {
    const url = new URL(
      'https://jt.ximalaya.com//GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&jt=https://example.com/episode.m4a',
    )

    expect(unwrapXimalaya(url)).toBeUndefined()
  })

  it('should return undefined for a target on a host that ends with xmcdn.com without the dot', () => {
    const url = new URL(
      'https://jt.ximalaya.com//GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&jt=https://examplexmcdn.com/episode.m4a',
    )

    expect(unwrapXimalaya(url)).toBeUndefined()
  })

  it('should return undefined for a target on a host that starts with an xmcdn.com host', () => {
    const url = new URL(
      'https://jt.ximalaya.com//GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&jt=https://audio.xmcdn.com.example.com/episode.m4a',
    )

    expect(unwrapXimalaya(url)).toBeUndefined()
  })

  it('should return undefined for a target that is not a url', () => {
    const url = new URL(
      'https://jt.ximalaya.com//GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&jt=audio.xmcdn.com/episode.m4a',
    )

    expect(unwrapXimalaya(url)).toBeUndefined()
  })

  it('should return undefined when the target is missing', () => {
    const url = new URL(
      'https://jt.ximalaya.com//GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&album_id=8685104',
    )

    expect(unwrapXimalaya(url)).toBeUndefined()
  })

  it('should return undefined for a path with a single leading slash', () => {
    const url = new URL(
      'https://jt.ximalaya.com/GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&jt=https://audio.xmcdn.com/episode.m4a',
    )

    expect(unwrapXimalaya(url)).toBeUndefined()
  })

  it('should return undefined for a path with more than one segment', () => {
    const url = new URL(
      'https://jt.ximalaya.com//album/GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&jt=https://audio.xmcdn.com/episode.m4a',
    )

    expect(unwrapXimalaya(url)).toBeUndefined()
  })

  it('should return undefined for a double slash after another segment', () => {
    const url = new URL(
      'https://jt.ximalaya.com/album//GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&jt=https://audio.xmcdn.com/episode.m4a',
    )

    expect(unwrapXimalaya(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com//GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&jt=https://audio.xmcdn.com/episode.m4a',
    )

    expect(unwrapXimalaya(url)).toBeUndefined()
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://jt.ximalaya.com//GKwRIJEHdJdaAK_G9QHh-p5O.m4a?channel=rss&album_id=8685104&track_id=597681973&uid=5669686&jt=https%253A%252F%252Faod.cos.tx.xmcdn.com%252Fstorages%252F738b-audiofreehighqps%252FDB%252F4C%252FGKwRIJEHdJdaAK_G9QHh-p5O.m4a',
    )

    expect(unwrapXimalaya(url)).toBe(
      'https://aod.cos.tx.xmcdn.com/storages/738b-audiofreehighqps/DB/4C/GKwRIJEHdJdaAK_G9QHh-p5O.m4a',
    )
  })
})
