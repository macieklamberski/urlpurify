import { describe, expect, it } from 'bun:test'
import { unwrapProofpointV3 } from './proofpointV3.js'

describe('unwrapProofpointV3', () => {
  it('should return the URL as-is when there is no replacement segment', () => {
    const url = new URL('https://urldefense.com/v3/__https://www.example.com/article__;!!abc!def$')

    expect(unwrapProofpointV3(url)).toBe('https://www.example.com/article')
  })

  it('should restore single `*` markers using base64 replacements', () => {
    // Replacement b64 'Iw' decodes to '#'.
    const url = new URL('https://urldefense.com/v3/__http://www.example.com/*test__;Iw!!abc!def$')

    expect(unwrapProofpointV3(url)).toBe('http://www.example.com/#test')
  })

  it('should restore `**X` runs using the byte count map', () => {
    // Replacement b64 'IyMjIyM' decodes to '#####' (5 chars). `**D` = 5 bytes.
    const url = new URL(
      'https://urldefense.com/v3/__http://www.example.com/**Dtest__;IyMjIyM!!abc!def$',
    )

    expect(unwrapProofpointV3(url)).toBe('http://www.example.com/#####test')
  })

  it('should accept the proofpoint.com host alias', () => {
    const url = new URL(
      'https://urldefense.proofpoint.com/v3/__https://www.example.com/article__;!!abc!def$',
    )

    expect(unwrapProofpointV3(url)).toBe('https://www.example.com/article')
  })

  it('should preserve query strings inside the mangled URL', () => {
    const url = new URL(
      'https://urldefense.com/v3/__https://www.example.com/path?q=hello__;!!abc!def$',
    )

    expect(unwrapProofpointV3(url)).toBe('https://www.example.com/path?q=hello')
  })

  it('should return undefined for non-v3 paths', () => {
    const url = new URL('https://urldefense.com/v2/url?u=https-3A__example.com_path')

    expect(unwrapProofpointV3(url)).toBeUndefined()
  })

  it('should return undefined for non-Proofpoint hosts', () => {
    const url = new URL('https://example.com/v3/__https://other.com__;!!abc!def$')

    expect(unwrapProofpointV3(url)).toBeUndefined()
  })

  it('should return undefined when replacements run out for a `*` marker', () => {
    // Two `*` markers but only one replacement char ('Iw' = '#').
    const url = new URL('https://urldefense.com/v3/__http://example.com/*foo*bar__;Iw!!abc!def$')

    expect(unwrapProofpointV3(url)).toBeUndefined()
  })

  it('should return undefined when replacements run out inside a `**X` run', () => {
    // `**E` = 6 bytes, but replacement b64 'Iw' = '#' is only 1 byte.
    const url = new URL('https://urldefense.com/v3/__http://example.com/**Etest__;Iw!!abc!def$')

    expect(unwrapProofpointV3(url)).toBeUndefined()
  })

  it('should carry saved bytes across multi-byte replacement boundaries', () => {
    // `**B` = 3 bytes. Replacement 'w6Pigqw' decodes to 'ã€'; 'ã' is 2 bytes,
    // '€' is 3 bytes. After 'ã' (2/3), peeking '€' (3 bytes) > remaining 1 byte
    // triggers savedBytes=1, which carries to the next `**A` (2-byte) run.
    const url = new URL('https://urldefense.com/v3/__http://x.test/**Bx**Ay__;w6Pigqw!!abc!def$')

    expect(unwrapProofpointV3(url)).toBe('http://x.test/ãx€y')
  })
})
