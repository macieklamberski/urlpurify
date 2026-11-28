import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapPrezly } from './prezly.js'

describe('unwrapPrezly', () => {
  it('should give https to a bare host target', () => {
    const value =
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/www.example.com'
    const expected = 'https://www.example.com/'

    expect(purifyUrl(value, { unwrappers: [unwrapPrezly] })).toBe(expected)
  })

  it('should extract the target from the click tracker', () => {
    const value = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/https%3A%2F%2Fwww.example.org%2Fen%2Fhuman-trafficking',
    )
    const expected = 'https://www.example.org/en/human-trafficking'

    expect(unwrapPrezly(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://prezlymail.com/c/22fb51af-77c4-4faf-87ef-441c386c64bd/8e8f44b2/https%3A%2F%2Fnews.example.com%2Fpost%3Futm_source%3Dprezly.com%26id%3D7',
    )
    const expected = 'https://news.example.com/post?utm_source=prezly.com&id=7'

    expect(unwrapPrezly(value)).toBe(expected)
  })

  it('should keep the wrapper for a non-http target', () => {
    const value =
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/mailto%3Apress%40example.com'

    expect(purifyUrl(value, { unwrappers: [unwrapPrezly] })).toBe(value)
  })

  it('should return undefined for a campaign that is not a uuid', () => {
    const value = new URL(
      'https://prezlymail.com/c/spring-launch/4535aa6c/https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPrezly(value)).toBeUndefined()
  })

  it('should return undefined for a link hash that is not hex', () => {
    const value = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/zzzzzzzz/https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPrezly(value)).toBeUndefined()
  })

  it('should keep a malformed escape in the target as written', () => {
    const value = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/https%3A%2F%2Fwww.example.org%2F%E0%A4%A',
    )
    const expected = 'https://www.example.org/%E0%A4%A'

    expect(unwrapPrezly(value)).toBe(expected)
  })

  it('should return undefined for the open pixel', () => {
    const value = new URL('https://prezlymail.com/o/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c')

    expect(unwrapPrezly(value)).toBeUndefined()
  })

  it('should return undefined for a click without the link hash', () => {
    const value = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPrezly(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPrezly(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/https%3A%2F%2Fwww.example.org%2Fen%2Fhuman-trafficking%23top',
    )
    const expected = 'https://www.example.org/en/human-trafficking#top'

    expect(unwrapPrezly(value)).toBe(expected)
  })
})
