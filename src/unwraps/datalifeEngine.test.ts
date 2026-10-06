import { describe, expect, it } from 'bun:test'
import { unwrapDatalifeEngine } from './datalifeEngine.js'

describe('unwrapDatalifeEngine', () => {
  it('should extract target from padded base64 url param', () => {
    const url = new URL(
      'https://www.example.com/engine/go.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvbC80NTkwMjg1MTM0ODQyMDgwLw%3D%3D',
    )

    expect(unwrapDatalifeEngine(url)).toBe('https://www.example.org/l/4590285134842080/')
  })

  it('should extract target from unpadded base64 url param', () => {
    const url = new URL(
      'https://www.example.com/engine/go.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvbC80NTkwMjg1MTM0ODQyMDgwMDYv',
    )

    expect(unwrapDatalifeEngine(url)).toBe('https://www.example.org/l/459028513484208006/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://www.example.com/engine/go.php?url=aHR0cHM6Ly9leGFtcGxlLm9yZy9zZWFyY2g%2FcT1hJTIwYiZwYWdlPTI%3D',
    )

    expect(unwrapDatalifeEngine(url)).toBe('https://example.org/search?q=a%20b&page=2')
  })

  it('should extract target from the index.php go route', () => {
    const url = new URL('https://www.example.com/index.php?do=go&url=aHR0cHM6Ly9leGFtcGxlLm9yZy8')

    expect(unwrapDatalifeEngine(url)).toBe('https://example.org/')
  })

  it('should return undefined for index.php with another do value', () => {
    const url = new URL(
      'https://www.example.com/index.php?do=search&url=aHR0cHM6Ly9leGFtcGxlLm9yZy8',
    )

    expect(unwrapDatalifeEngine(url)).toBeUndefined()
  })

  it('should return undefined for the go route under a prefix', () => {
    const url = new URL(
      'https://www.example.com/forum/index.php?do=go&url=aHR0cHM6Ly9leGFtcGxlLm9yZy8',
    )

    expect(unwrapDatalifeEngine(url)).toBeUndefined()
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL(
      'https://www.example.com/go.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvbC80NTkwMjg1MTM0ODQyMDgwLw%3D%3D',
    )

    expect(unwrapDatalifeEngine(url)).toBeUndefined()
  })

  it('should return undefined for the path under a prefix', () => {
    const url = new URL(
      'https://www.example.com/admin/engine/go.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvbC80NTkwMjg1MTM0ODQyMDgwLw%3D%3D',
    )

    expect(unwrapDatalifeEngine(url)).toBeUndefined()
  })

  it('should return undefined for a plain url', () => {
    const url = new URL('https://www.example.com/engine/go.php?url=http://example.org/')

    expect(unwrapDatalifeEngine(url)).toBeUndefined()
  })

  it('should return undefined for a base64 non-http target', () => {
    const url = new URL(
      'https://www.example.com/engine/go.php?url=amF2YXNjcmlwdDphbGVydCgxKQ%3D%3D',
    )

    expect(unwrapDatalifeEngine(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://www.example.com/engine/go.php?id=42')

    expect(unwrapDatalifeEngine(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://www.example.com/engine/go.php?url=')

    expect(unwrapDatalifeEngine(url)).toBeUndefined()
  })
})
