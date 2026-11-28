import { describe, expect, it } from 'bun:test'
import { unwrapProofpointV3 } from './proofpointV3.js'

describe('unwrapProofpointV3', () => {
  it('should return the URL as-is when there is no replacement segment', () => {
    const value = new URL(
      'https://urldefense.com/v3/__https://www.example.com/article__;!!abc!def$',
    )
    const expected = 'https://www.example.com/article'

    expect(unwrapProofpointV3(value)).toBe(expected)
  })

  it('should restore single `*` markers using base64 replacements', () => {
    // Replacement b64 'Iw' decodes to '#'.
    const value = new URL('https://urldefense.com/v3/__http://www.example.com/*test__;Iw!!abc!def$')
    const expected = 'http://www.example.com/#test'

    expect(unwrapProofpointV3(value)).toBe(expected)
  })

  it('should restore `**X` runs using the byte count map', () => {
    // Replacement b64 'IyMjIyM' decodes to '#####' (5 chars). `**D` = 5 bytes.
    const value = new URL(
      'https://urldefense.com/v3/__http://www.example.com/**Dtest__;IyMjIyM!!abc!def$',
    )
    const expected = 'http://www.example.com/#####test'

    expect(unwrapProofpointV3(value)).toBe(expected)
  })

  it('should preserve query strings inside the mangled URL', () => {
    const value = new URL(
      'https://urldefense.com/v3/__https://www.example.com/path?q=hello__;!!abc!def$',
    )
    const expected = 'https://www.example.com/path?q=hello'

    expect(unwrapProofpointV3(value)).toBe(expected)
  })

  it('should unwrap when a rewritten query escapes the closing delimiters', () => {
    const value = new URL(
      'https://urldefense.com/v3/__https://www.example.com/path?id=1__%3B%21%21abc%21def%24&utm_medium=email',
    )
    const expected = 'https://www.example.com/path?id=1'

    expect(unwrapProofpointV3(value)).toBe(expected)
  })

  it('should unwrap an escaped replacement segment', () => {
    // Replacement b64 'JSUl' decodes to '%%%'.
    const value = new URL(
      'https://urldefense.com/v3/__https://www.example.com/?u=https*3A*2F*2Fexample.org__%3BJSUl!!abc!def%24',
    )
    const expected = 'https://www.example.com/?u=https%3A%2F%2Fexample.org'

    expect(unwrapProofpointV3(value)).toBe(expected)
  })

  it('should unwrap markers escaped along with the delimiters', () => {
    const value = new URL(
      'https://urldefense.com/v3/__https://www.example.com/?u=https%2A3A%2A2F%2A2Fexample.org__%3BJSUl%21%21abc%21def%24',
    )
    const expected = 'https://www.example.com/?u=https%3A%2F%2Fexample.org'

    expect(unwrapProofpointV3(value)).toBe(expected)
  })

  it('should return undefined for non-v3 paths', () => {
    const value = new URL('https://urldefense.com/v2/url?u=https-3A__example.com_path')

    expect(unwrapProofpointV3(value)).toBeUndefined()
  })

  it('should return undefined for non-Proofpoint hosts', () => {
    const value = new URL('https://example.com/v3/__https://other.com__;!!abc!def$')

    expect(unwrapProofpointV3(value)).toBeUndefined()
  })

  it('should return undefined when replacements run out for a `*` marker', () => {
    // Two `*` markers but only one replacement char ('Iw' = '#').
    const value = new URL('https://urldefense.com/v3/__http://example.com/*foo*bar__;Iw!!abc!def$')

    expect(unwrapProofpointV3(value)).toBeUndefined()
  })

  it('should return undefined when replacements run out inside a `**X` run', () => {
    // `**E` = 6 bytes, but replacement b64 'Iw' = '#' is only 1 byte.
    const value = new URL('https://urldefense.com/v3/__http://example.com/**Etest__;Iw!!abc!def$')

    expect(unwrapProofpointV3(value)).toBeUndefined()
  })

  it('should return undefined when the replacement segment is not valid base64', () => {
    // The replacement segment 'I' is truncated from 'Iw' and cannot be decoded.
    const value = new URL(
      'https://urldefense.com/v3/__https://www.example.com/*/__;I!!KVWo1iE!SMec7SFEcXPxdLhKneRkgk2g6rBf9qJnUxcz6IvlZTpfKCTAqA62J9L1o4Wonjoipb8u828VvIOSPofPO-7z35KPMQ$',
    )

    expect(unwrapProofpointV3(value)).toBeUndefined()
  })

  it('should carry saved bytes across multi-byte replacement boundaries', () => {
    // `**B` = 3 bytes. Replacement 'w6Pigqw' decodes to 'ã€'; 'ã' is 2 bytes,
    // '€' is 3 bytes. After 'ã' (2/3), peeking '€' (3 bytes) > remaining 1 byte
    // triggers savedBytes=1, which carries to the next `**A` (2-byte) run.
    const value = new URL('https://urldefense.com/v3/__http://x.test/**Bx**Ay__;w6Pigqw!!abc!def$')
    const expected = 'http://x.test/ãx€y'

    expect(unwrapProofpointV3(value)).toBe(expected)
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://urldefense.com/v4/__https://www.example.com/article__;!!abc!def$',
    )

    expect(unwrapProofpointV3(value)).toBeUndefined()
  })
})
