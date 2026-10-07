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

  it('should extract a target with its scheme dropped from a snapshot', () => {
    const url = new URL(
      'https://warp.ndl.go.jp/web/20201211204344/www.example.jp/j/approach/agenda/guideline/2019/pdf/20181218_e.pdf',
    )

    expect(unwrapNdlWarp(url)).toBe(
      'http://www.example.jp/j/approach/agenda/guideline/2019/pdf/20181218_e.pdf',
    )
  })

  it('should extract the target from the persistent-id form', () => {
    const url = new URL(
      'https://warp.da.ndl.go.jp/info:ndljp/pid/286890/www.example.jp/kohosys/press/0003982/index.html',
    )

    expect(unwrapNdlWarp(url)).toBe('http://www.example.jp/kohosys/press/0003982/index.html')
  })

  it('should extract the target from the persistent-id form on warp.ndl.go.jp', () => {
    const url = new URL(
      'https://warp.ndl.go.jp/info:ndljp/pid/11663707/www.example.jp/jp/singi/jinsei100nen/dai1/siryou4-2.pdf',
    )

    expect(unwrapNdlWarp(url)).toBe(
      'http://www.example.jp/jp/singi/jinsei100nen/dai1/siryou4-2.pdf',
    )
  })

  it('should keep the scheme of a target in the persistent-id form', () => {
    const url = new URL(
      'https://warp.da.ndl.go.jp/info:ndljp/pid/286890/https://www.example.jp/press/20090206001/20090206001.html',
    )

    expect(unwrapNdlWarp(url)).toBe('https://www.example.jp/press/20090206001/20090206001.html')
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://warp.ndl.go.jp/web/20220308210930/')

    expect(unwrapNdlWarp(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://warp.ndl.go.jp/web/20220308210930/ftp://example.jp/file.txt')

    expect(unwrapNdlWarp(url)).toBeUndefined()
  })

  it('should return undefined for a partial timestamp', () => {
    const url = new URL('https://warp.ndl.go.jp/web/2022/https://www.example.jp/')

    expect(unwrapNdlWarp(url)).toBeUndefined()
  })

  it('should return undefined for the persistent id with no target', () => {
    const url = new URL('https://warp.da.ndl.go.jp/info:ndljp/pid/286890/')

    expect(unwrapNdlWarp(url)).toBeUndefined()
  })

  it('should return undefined for a persistent id that is not a number', () => {
    const url = new URL('https://warp.da.ndl.go.jp/info:ndljp/pid/search/www.example.jp/')

    expect(unwrapNdlWarp(url)).toBeUndefined()
  })

  it('should return undefined for a snapshot on warp.da.ndl.go.jp', () => {
    const url = new URL('https://warp.da.ndl.go.jp/web/20220308210930/www.example.jp/')

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
