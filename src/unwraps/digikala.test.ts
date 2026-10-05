import { describe, expect, it } from 'bun:test'
import { unwrapDigikala } from './digikala.js'

describe('unwrapDigikala', () => {
  it('should decode target from b64 param', () => {
    const url = new URL(
      'https://dgkl.io/api/v1/Click/b/iMcDp?b64=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vcHJvZHVjdC9ka3AtNDAxMDk5',
    )

    expect(unwrapDigikala(url)).toBe('https://www.example.com/product/dkp-401099')
  })

  it('should decode a padded target with its own query', () => {
    const url = new URL(
      'https://dgkl.io/api/v1/Click/b/Clm91?b64=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vc2VhcmNoL2NhdGVnb3J5LXRvb2wtYm94Lz9zb3J0PTI3',
    )

    expect(unwrapDigikala(url)).toBe('https://www.example.com/search/category-tool-box/?sort=27')
  })

  it('should return undefined when b64 param is missing', () => {
    const url = new URL('https://dgkl.io/api/v1/Click/b/iMcDp')

    expect(unwrapDigikala(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://dgkl.io/api/v1/Click/b/iMcDp?b64=amF2YXNjcmlwdDphbGVydCgxKQ==')

    expect(unwrapDigikala(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Digikala host', () => {
    const url = new URL(
      'https://dgkl.io/api/v1/Click/a/iMcDp?b64=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vcHJvZHVjdC9ka3AtNDAxMDk5',
    )

    expect(unwrapDigikala(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/api/v1/Click/b/iMcDp?b64=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vcHJvZHVjdC9ka3AtNDAxMDk5',
    )

    expect(unwrapDigikala(url)).toBeUndefined()
  })
})
