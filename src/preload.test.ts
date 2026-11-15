import { describe, expect, it } from 'bun:test'
import { guardUnwrapper } from './preload.js'
import { withScope } from './scope.js'
import type { UrlUnwrapper } from './types.js'

// Reads `target` on any host, but its scope names one host.
const narrowScopeUnwrapper: UrlUnwrapper = withScope(
  (url) => url.searchParams.get('target') ?? undefined,
  { hosts: 'redirect.example.com' },
)

describe('guardUnwrapper', () => {
  it('should return the target for a url inside the scope', () => {
    const guarded = guardUnwrapper('unwrapExample', narrowScopeUnwrapper)
    const value = new URL('https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(guarded(value)).toBe(expected)
  })

  it('should throw when a target comes back for a url outside the scope', () => {
    const guarded = guardUnwrapper('unwrapExample', narrowScopeUnwrapper)
    const value = new URL('https://other.example.com/?target=https%3A%2F%2Fexample.com%2Fpost')
    const throwing = () => guarded(value)

    expect(throwing).toThrow('unwrapExample unwrapped')
  })

  it('should keep the scope of the unwrapper it guards', () => {
    const guarded = guardUnwrapper('unwrapExample', narrowScopeUnwrapper)

    expect(guarded.scope).toBe(narrowScopeUnwrapper.scope)
  })
})
