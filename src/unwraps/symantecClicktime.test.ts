import { describe, expect, it } from 'bun:test'
import { unwrapSymantecClicktime } from './symantecClicktime.js'

describe('unwrapSymantecClicktime', () => {
  it('should extract target from u param', () => {
    const value = new URL(
      'https://clicktime.symantec.com/3FEDiehu2Ddi9k8pX4CcF857Vc?u=http%3A%2F%2Fexample.com%2F',
    )
    const expected = 'http://example.com/'

    expect(unwrapSymantecClicktime(value)).toBe(expected)
  })

  it('should extract an unencoded target after an h param', () => {
    const value = new URL(
      'https://clicktime.symantec.com/15sLvRD3oLYf8RJd12KM3?h=PvINXCX_VUn2RtnzX7Hqw1cSTLAAGHcF1KaQWZnk-qs=&u=https://community.example.com/t5/ideas/m-p/1215361',
    )
    const expected = 'https://community.example.com/t5/ideas/m-p/1215361'

    expect(unwrapSymantecClicktime(value)).toBe(expected)
  })

  it('should extract target from u param on the a/1 path', () => {
    const value = new URL(
      'https://clicktime.symantec.com/a/1/dAl80F97mCKKHPWU-8UhutWbtfAspZUbZyEUtmN_XRk=?d=t6D3BqARsd5WWd1KBwRVgtvFxJlopQk5cCgAJNgxvDJdw6kO7lfuAMqW3JGsQYm2&u=http%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapSymantecClicktime(value)).toBe(expected)
  })

  it('should return undefined for the a/1 path without u param', () => {
    const value = new URL(
      'https://clicktime.symantec.com/a/1/dAl80F97mCKKHPWU-8UhutWbtfAspZUbZyEUtmN_XRk=?d=t6D3BqARsd5WWd1KBwRVgtvFxJlopQk5cCgAJNgxvDJdw6kO7lfuAMqW3JGsQYm2',
    )

    expect(unwrapSymantecClicktime(value)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://clicktime.symantec.com/3FEDiehu2Ddi9k8pX4CcF857Vc')

    expect(unwrapSymantecClicktime(value)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const value = new URL('https://clicktime.symantec.com/3FEDiehu2Ddi9k8pX4CcF857Vc?u=')

    expect(unwrapSymantecClicktime(value)).toBeUndefined()
  })

  it('should return undefined for a nested path', () => {
    const value = new URL(
      'https://clicktime.symantec.com/3FEDiehu2Ddi9k8pX4CcF857Vc/extra?u=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapSymantecClicktime(value)).toBeUndefined()
  })

  it('should return undefined for the root path', () => {
    const value = new URL('https://clicktime.symantec.com/?u=http%3A%2F%2Fexample.com%2F')

    expect(unwrapSymantecClicktime(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://example.com/3FEDiehu2Ddi9k8pX4CcF857Vc?u=http%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapSymantecClicktime(value)).toBeUndefined()
  })
})
