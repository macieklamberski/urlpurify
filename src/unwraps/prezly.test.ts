import { describe, expect, it } from 'bun:test'
import { unwrapPrezly } from './prezly.js'

describe('unwrapPrezly', () => {
  it('should extract the target from the click tracker', () => {
    const url = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/https%3A%2F%2Fwww.example.org%2Fen%2Fhuman-trafficking',
    )

    expect(unwrapPrezly(url)).toBe('https://www.example.org/en/human-trafficking')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://prezlymail.com/c/22fb51af-77c4-4faf-87ef-441c386c64bd/8e8f44b2/https%3A%2F%2Fnews.example.com%2Fpost%3Futm_source%3Dprezly.com%26id%3D7',
    )

    expect(unwrapPrezly(url)).toBe('https://news.example.com/post?utm_source=prezly.com&id=7')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/mailto%3Apress%40example.com',
    )

    expect(unwrapPrezly(url)).toBeUndefined()
  })

  it('should return undefined for a campaign that is not a uuid', () => {
    const url = new URL(
      'https://prezlymail.com/c/spring-launch/4535aa6c/https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPrezly(url)).toBeUndefined()
  })

  it('should return undefined for a link hash that is not hex', () => {
    const url = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/zzzzzzzz/https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPrezly(url)).toBeUndefined()
  })

  it('should return undefined for a malformed escape in the target', () => {
    const url = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/https%3A%2F%2Fwww.example.org%2F%E0%A4%A',
    )

    expect(unwrapPrezly(url)).toBeUndefined()
  })

  it('should return undefined for the open pixel', () => {
    const url = new URL('https://prezlymail.com/o/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c')

    expect(unwrapPrezly(url)).toBeUndefined()
  })

  it('should return undefined for a click without the link hash', () => {
    const url = new URL(
      'https://prezlymail.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPrezly(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/c/264cd01e-3f4c-475e-87a2-4d7f7c7ddc7d/4535aa6c/https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPrezly(url)).toBeUndefined()
  })
})
