import { describe, expect, it } from 'bun:test'
import { unwrapMailinblack } from './mailinblack.js'

describe('unwrapMailinblack', () => {
  it('should extract the full target from the key param', () => {
    const url = new URL(
      'https://mibc-fr-11.mailinblack.com/securelink/?url=https://www.example.com&key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJodHRwczovL3d3dy5leGFtcGxlLmNvbS9ldmVuZW1lbnQvdGhlYXRyZS1ldC1ib3R0ZXMtZGUtcGFpbGxlLyIsInRva2VuIjoiZ0FBQUFBQm5VMkhhUEVsLUNMV01xZldCd1pZaEFWQzFYQU1mSzNpaSJ9',
    )

    expect(unwrapMailinblack(url)).toBe(
      'https://www.example.com/evenement/theatre-et-bottes-de-paille/',
    )
  })

  it('should extract the full target on a partner host', () => {
    const url = new URL(
      'https://mib.numerian.fr/securelink/?url=https://www.example.com&key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJodHRwczovL3d3dy5leGFtcGxlLmNvbS9ldmVuZW1lbnQvdGhlYXRyZS1ldC1ib3R0ZXMtZGUtcGFpbGxlLyIsInRva2VuIjoiZ0FBQUFBQm5VMkhhUEVsLUNMV01xZldCd1pZaEFWQzFYQU1mSzNpaSJ9',
    )

    expect(unwrapMailinblack(url)).toBe(
      'https://www.example.com/evenement/theatre-et-bottes-de-paille/',
    )
  })

  it('should decode a base64url key param', () => {
    const url = new URL(
      'https://mibc-fr-09.mailinblack.com/securelink/?url=https://example.com&key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJodHRwczovL2V4YW1wbGUuY29tL3BhZ2U_aWQ9MSZsYW5nPWZyIiwidG9rZW4iOiJnQUFBQUFCblUySGEifQ==',
    )

    expect(unwrapMailinblack(url)).toBe('https://example.com/page?id=1&lang=fr')
  })

  it('should decode a key param without padding', () => {
    const url = new URL(
      'https://mibc-fr-03.mailinblack.com/securelink/?url=https://example.com&key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJodHRwczovL2V4YW1wbGUuY29tL3NlYXJjaD9xPWZlZWRzJnBhZ2U9MiIsInRva2VuIjoiZ0FBQUFBQm5VMkhhUEVsIn0',
    )

    expect(unwrapMailinblack(url)).toBe('https://example.com/search?q=feeds&page=2')
  })

  it('should return undefined when the key holds a non-http url', () => {
    const url = new URL(
      'https://mibc-fr-11.mailinblack.com/securelink/?url=https://example.com&key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJtYWlsdG86aW5mb0BleGFtcGxlLmNvbSIsInRva2VuIjoiZ0FBQUFBQm5VMkhhUEVsIn0=',
    )

    expect(unwrapMailinblack(url)).toBeUndefined()
  })

  it('should return undefined when the key has no url field', () => {
    const url = new URL(
      'https://mibc-fr-11.mailinblack.com/securelink/?url=https://example.com&key=eyJsYW5nIjoiRlIiLCJ0b2tlbiI6ImdBQUFBQUJuVTJIYVBFbCJ9',
    )

    expect(unwrapMailinblack(url)).toBeUndefined()
  })

  it('should return undefined when the key is not json', () => {
    const url = new URL(
      'https://mibc-fr-11.mailinblack.com/securelink/?url=https://example.com&key=bm90IGpzb24=',
    )

    expect(unwrapMailinblack(url)).toBeUndefined()
  })

  it('should return undefined when the key is truncated mid-base64', () => {
    const url = new URL(
      'https://mibc-fr-11.mailinblack.com/securelink/?url=https://www.example.com&key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJodHRwczovL3d3dy5leGFtcGxlLmNvbS9ldmVuZW1lbnQvdGhlYXRyZS1ldC1ib3R0ZXMtZGUtcGFpbGxlLyIsInRva2VuIjoiZ0FBQUFBQm5VMkhhUEVsLUNMV01xZldCd1pZaEFWQzFYQU1mSzNpa',
    )

    expect(unwrapMailinblack(url)).toBeUndefined()
  })

  it('should return undefined when the key param is empty', () => {
    const url = new URL(
      'https://mibc-fr-05.mailinblack.com/securelink/?url=http://example.com&key=',
    )

    expect(unwrapMailinblack(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host without a valid key', () => {
    const url = new URL('https://example.com/securelink/?url=https://example.org&key=bm90IGpzb24=')

    expect(unwrapMailinblack(url)).toBeUndefined()
  })

  it('should return undefined for a longer path', () => {
    const url = new URL(
      'https://mibc-fr-11.mailinblack.com/securelink/x?key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJodHRwczovL2V4YW1wbGUuY29tL3NlYXJjaD9xPWZlZWRzJnBhZ2U9MiIsInRva2VuIjoiZ0FBQUFBQm5VMkhhUEVsIn0=',
    )

    expect(unwrapMailinblack(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://mibc-fr-11.mailinblack.com/?key=eyJsYW5nIjoiRlIiLCJ1cmwiOiJodHRwczovL2V4YW1wbGUuY29tL3NlYXJjaD9xPWZlZWRzJnBhZ2U9MiIsInRva2VuIjoiZ0FBQUFBQm5VMkhhUEVsIn0=',
    )

    expect(unwrapMailinblack(url)).toBeUndefined()
  })
})
