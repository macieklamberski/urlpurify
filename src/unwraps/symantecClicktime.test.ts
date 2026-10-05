import { describe, expect, it } from 'bun:test'
import { unwrapSymantecClicktime } from './symantecClicktime.js'

describe('unwrapSymantecClicktime', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://clicktime.symantec.com/3FEDiehu2Ddi9k8pX4CcF857Vc?u=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapSymantecClicktime(url)).toBe('http://example.com/')
  })

  it('should extract an unencoded target after an h param', () => {
    const url = new URL(
      'https://clicktime.symantec.com/15sLvRD3oLYf8RJd12KM3?h=PvINXCX_VUn2RtnzX7Hqw1cSTLAAGHcF1KaQWZnk-qs=&u=https://community.example.com/t5/ideas/m-p/1215361',
    )

    expect(unwrapSymantecClicktime(url)).toBe('https://community.example.com/t5/ideas/m-p/1215361')
  })

  it('should extract target from u param on the a/1 path', () => {
    const url = new URL(
      'https://clicktime.symantec.com/a/1/dAl80F97mCKKHPWU-8UhutWbtfAspZUbZyEUtmN_XRk=?d=t6D3BqARsd5WWd1KBwRVgtvFxJlopQk5cCgAJNgxvDJdw6kO7lfuAMqW3JGsQYm2&u=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapSymantecClicktime(url)).toBe('http://www.example.com/')
  })

  it('should return undefined for the a/1 path without u param', () => {
    const url = new URL(
      'https://clicktime.symantec.com/a/1/dAl80F97mCKKHPWU-8UhutWbtfAspZUbZyEUtmN_XRk=?d=t6D3BqARsd5WWd1KBwRVgtvFxJlopQk5cCgAJNgxvDJdw6kO7lfuAMqW3JGsQYm2',
    )

    expect(unwrapSymantecClicktime(url)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://clicktime.symantec.com/3FEDiehu2Ddi9k8pX4CcF857Vc')

    expect(unwrapSymantecClicktime(url)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const url = new URL('https://clicktime.symantec.com/3FEDiehu2Ddi9k8pX4CcF857Vc?u=')

    expect(unwrapSymantecClicktime(url)).toBeUndefined()
  })

  it('should return undefined for a nested path', () => {
    const url = new URL(
      'https://clicktime.symantec.com/3FEDiehu2Ddi9k8pX4CcF857Vc/extra?u=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapSymantecClicktime(url)).toBeUndefined()
  })

  it('should return undefined for the root path', () => {
    const url = new URL('https://clicktime.symantec.com/?u=http%3A%2F%2Fexample.com%2F')

    expect(unwrapSymantecClicktime(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL(
      'https://example.com/3FEDiehu2Ddi9k8pX4CcF857Vc?u=http%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapSymantecClicktime(url)).toBeUndefined()
  })
})
