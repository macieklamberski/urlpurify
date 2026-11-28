import { describe, expect, it } from 'bun:test'
import { unwrapValuePress } from './valuePress.js'

describe('unwrapValuePress', () => {
  it('should extract the target from the click counter', () => {
    const value = new URL(
      'https://www.value-press.com/bin/tools/link_counter?a=wzvsijkdsbe&l=YUhSMGNITTZMeTkzZDNjdWVXOTFkSFZpWlM1amIyMHZjMmh2Y25SekwwVnhRMFpMVVZOelFUWTA%3D',
    )
    const expected = 'https://www.youtube.com/shorts/EqCFKQSsA64'

    expect(unwrapValuePress(value)).toBe(expected)
  })

  it('should extract the target with the id after the carrier', () => {
    const value = new URL(
      'https://www.value-press.com/bin/tools/link_counter?l=YUhSMGNEb3ZMM2QzZHk1bVlXTmxZbTl2YXk1amIyMHZkRzlyZVc5dmRHRnJkVzF2WkdVPQ%3D%3D&a=jrqbeyyseht',
    )
    const expected = 'http://www.facebook.com/tokyootakumode'

    expect(unwrapValuePress(value)).toBe(expected)
  })

  it('should extract a target with its own query', () => {
    const value = new URL(
      'https://www.value-press.com/bin/tools/link_counter?a=x&l=YUhSMGNITTZMeTkzZDNjdVpYaGhiWEJzWlM1amIyMHZibVYzY3k5eVpXeGxZWE5sUDJsa1BUUXlKbXhoYm1jOVpXND0%3D',
    )
    const expected = 'https://www.example.com/news/release?id=42&lang=en'

    expect(unwrapValuePress(value)).toBe(expected)
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'https://www.value-press.com/bin/tools/link_counter?a=x&l=Wm5Sd09pOHZaWGhoYlhCc1pTNWpiMjB2Wm1sc1pTNTBlSFE9',
    )

    expect(unwrapValuePress(value)).toBeUndefined()
  })

  it('should return undefined for a carrier that is not base64', () => {
    const value = new URL('https://www.value-press.com/bin/tools/link_counter?a=x&l=%25%25%25')

    expect(unwrapValuePress(value)).toBeUndefined()
  })

  it('should return undefined for a carrier that decodes once into a url', () => {
    const value = new URL(
      'https://www.value-press.com/bin/tools/link_counter?a=x&l=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v',
    )

    expect(unwrapValuePress(value)).toBeUndefined()
  })

  it('should return undefined for the click counter without a carrier', () => {
    const urlWithoutCarrier = new URL('https://www.value-press.com/bin/tools/link_counter?a=x')
    const urlWithEmptyCarrier = new URL('https://www.value-press.com/bin/tools/link_counter?a=x&l=')

    expect(unwrapValuePress(urlWithoutCarrier)).toBeUndefined()
    expect(unwrapValuePress(urlWithEmptyCarrier)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://www.value-press.com/pressrelease/379051')

    expect(unwrapValuePress(value)).toBeUndefined()
  })

  it('should return undefined for the click counter on another host', () => {
    const value = new URL(
      'https://example.com/bin/tools/link_counter?a=x&l=YUhSMGNITTZMeTkzZDNjdVpYaGhiWEJzWlM1amIyMHZibVYzY3k5eVpXeGxZWE5sUDJsa1BUUXlKbXhoYm1jOVpXND0%3D',
    )

    expect(unwrapValuePress(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://www.value-press.com/bin/tools/link_counter?a=wzvsijkdsbe&l=YUhSMGNITTZMeTkzZDNjdVpYaGhiWEJzWlM1amIyMHZjMmh2Y25SekwwVnhRMFpMVVZOelFUWTBJM1J2Y0E9PQ%3D%3D',
    )
    const expected = 'https://www.example.com/shorts/EqCFKQSsA64#top'

    expect(unwrapValuePress(value)).toBe(expected)
  })
})
