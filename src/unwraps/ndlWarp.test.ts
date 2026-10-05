import { describe, expect, it } from 'bun:test'
import { unwrapNdlWarp } from './ndlWarp.js'

describe('unwrapNdlWarp', () => {
  it('should extract the target from a snapshot', () => {
    const url = new URL(
      'https://warp.ndl.go.jp/web/20220308210930/https://www.example.lg.jp/shikai/page/0000276393.html',
    )

    expect(unwrapNdlWarp(url)).toBe('https://www.example.lg.jp/shikai/page/0000276393.html')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://warp.ndl.go.jp/web/20240916031321/http://www.example.com/2006/jp/event/index.html?lang=ja#program',
    )

    expect(unwrapNdlWarp(url)).toBe(
      'http://www.example.com/2006/jp/event/index.html?lang=ja#program',
    )
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://warp.ndl.go.jp/web/20220308210930/')

    expect(unwrapNdlWarp(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://warp.ndl.go.jp/web/20220308210930/ftp://example.jp/file.txt')

    expect(unwrapNdlWarp(url)).toBeUndefined()
  })

  it('should return undefined for the archive search', () => {
    const url = new URL(
      'https://warp.ndl.go.jp/search/ArchiveSearch/WE11.jsp?collectDate=20220308&originalUrl=https://www.example.jp/',
    )

    expect(unwrapNdlWarp(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://www.ndl.go.jp/web/20220308210930/https://www.example.jp/')

    expect(unwrapNdlWarp(url)).toBeUndefined()
  })
})
