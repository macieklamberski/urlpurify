import { describe, expect, it } from 'bun:test'
import { unwrapNaverOutgoing } from './naverOutgoing.js'

describe('unwrapNaverOutgoing', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'http://cc.loginfra.com/cc?a=sug.image&r=&i=&m=1&nsc=v.all&u=https://example.com/csrs-information/csrs',
    )

    expect(unwrapNaverOutgoing(url)).toBe('https://example.com/csrs-information/csrs')
  })

  it('should extract target from a search result click', () => {
    const url = new URL(
      'https://search.naver.com/p/crd/rd?m=1&px=702&py=2867&sx=702&sy=467&vw=1920&vh=919&p=jM9n5sqVOsoss5aOmS4ssssss70-215222&ie=utf8&rev=1&f=nexearch&w=nexearch&s=4pG9g0GwTASRU5MSXSYUNQry&time=1760513847271&a=ugB_bsR*b.link&r=3&u=https%3A%2F%2Fexample.com%2Fsise%2Findex.nhn%3Fcode%3DKOSPI',
    )

    expect(unwrapNaverOutgoing(url)).toBe('https://example.com/sise/index.nhn?code=KOSPI')
  })

  it('should return undefined for a search result click without u param', () => {
    const url = new URL('https://search.naver.com/p/crd/rd?m=1&p=jM9n5sqVOsoss5aOmS4ssssss70&r=3')

    expect(unwrapNaverOutgoing(url)).toBeUndefined()
  })

  it('should return undefined for another path on the search host', () => {
    const url = new URL(
      'https://search.naver.com/search.naver?where=nexearch&u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapNaverOutgoing(url)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('http://cc.loginfra.com/cc?a=sug.image')

    expect(unwrapNaverOutgoing(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('http://cc.loginfra.com/other?u=https://example.com/')

    expect(unwrapNaverOutgoing(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/cc?u=https://example.org/')

    expect(unwrapNaverOutgoing(url)).toBeUndefined()
  })
})
