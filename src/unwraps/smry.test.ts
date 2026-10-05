import { describe, expect, it } from 'bun:test'
import { unwrapSmry } from './smry.js'

describe('unwrapSmry', () => {
  it('should extract the target from the proxy', () => {
    const url = new URL(
      'https://www.smry.ai/proxy?url=https%3A%2F%2Fwww.example.com%2Ftechnology%2F2026%2Ffeb%2F25%2Fstory',
    )

    expect(unwrapSmry(url)).toBe('https://www.example.com/technology/2026/feb/25/story')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://www.smry.ai/proxy?url=https://www.example.com/espana/madrid/2025-10-10/video',
    )

    expect(unwrapSmry(url)).toBe('https://www.example.com/espana/madrid/2025-10-10/video')
  })

  it('should extract the target on the bare host', () => {
    const url = new URL(
      'https://smry.ai/proxy?url=https%3A%2F%2Fwww.example.com%2Fmagazine%2F2026%2F03%2Fai-economy%2F',
    )

    expect(unwrapSmry(url)).toBe('https://www.example.com/magazine/2026/03/ai-economy/')
  })

  it('should return undefined for the proxy without url', () => {
    const url = new URL('https://www.smry.ai/proxy')

    expect(unwrapSmry(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://smry.ai/summary?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapSmry(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/proxy?url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapSmry(url)).toBeUndefined()
  })
})
