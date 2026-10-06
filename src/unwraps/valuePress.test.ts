import { describe, expect, it } from 'bun:test'
import { unwrapValuePress } from './valuePress.js'

describe('unwrapValuePress', () => {
  it('should extract the target from the click counter', () => {
    const url = new URL(
      'https://www.value-press.com/bin/tools/link_counter?a=wzvsijkdsbe&l=YUhSMGNITTZMeTkzZDNjdWVXOTFkSFZpWlM1amIyMHZjMmh2Y25SekwwVnhRMFpMVVZOelFUWTA%3D',
    )

    expect(unwrapValuePress(url)).toBe('https://www.youtube.com/shorts/EqCFKQSsA64')
  })

  it('should extract the target with the id after the carrier', () => {
    const url = new URL(
      'https://www.value-press.com/bin/tools/link_counter?l=YUhSMGNEb3ZMM2QzZHk1bVlXTmxZbTl2YXk1amIyMHZkRzlyZVc5dmRHRnJkVzF2WkdVPQ%3D%3D&a=jrqbeyyseht',
    )

    expect(unwrapValuePress(url)).toBe('http://www.facebook.com/tokyootakumode')
  })

  it('should extract a target with its own query', () => {
    const url = new URL(
      'https://www.value-press.com/bin/tools/link_counter?a=x&l=YUhSMGNITTZMeTkzZDNjdVpYaGhiWEJzWlM1amIyMHZibVYzY3k5eVpXeGxZWE5sUDJsa1BUUXlKbXhoYm1jOVpXND0%3D',
    )

    expect(unwrapValuePress(url)).toBe('https://www.example.com/news/release?id=42&lang=en')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://www.value-press.com/bin/tools/link_counter?a=x&l=Wm5Sd09pOHZaWGhoYlhCc1pTNWpiMjB2Wm1sc1pTNTBlSFE9',
    )

    expect(unwrapValuePress(url)).toBeUndefined()
  })

  it('should return undefined for a carrier that is not base64', () => {
    const url = new URL('https://www.value-press.com/bin/tools/link_counter?a=x&l=%25%25%25')

    expect(unwrapValuePress(url)).toBeUndefined()
  })

  it('should return undefined for a carrier that decodes once into a url', () => {
    const url = new URL(
      'https://www.value-press.com/bin/tools/link_counter?a=x&l=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v',
    )

    expect(unwrapValuePress(url)).toBeUndefined()
  })

  it('should return undefined for the click counter without a carrier', () => {
    expect(
      unwrapValuePress(new URL('https://www.value-press.com/bin/tools/link_counter?a=x')),
    ).toBeUndefined()
    expect(
      unwrapValuePress(new URL('https://www.value-press.com/bin/tools/link_counter?a=x&l=')),
    ).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://www.value-press.com/pressrelease/379051')

    expect(unwrapValuePress(url)).toBeUndefined()
  })

  it('should return undefined for the click counter on another host', () => {
    const url = new URL(
      'https://example.com/bin/tools/link_counter?a=x&l=YUhSMGNITTZMeTkzZDNjdVpYaGhiWEJzWlM1amIyMHZibVYzY3k5eVpXeGxZWE5sUDJsa1BUUXlKbXhoYm1jOVpXND0%3D',
    )

    expect(unwrapValuePress(url)).toBeUndefined()
  })
})
