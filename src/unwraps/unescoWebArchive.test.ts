import { describe, expect, it } from 'bun:test'
import { unwrapUnescoWebArchive } from './unescoWebArchive.js'

describe('unwrapUnescoWebArchive', () => {
  it('should extract the target from a snapshot', () => {
    const url = new URL(
      'https://webarchive.unesco.org/web/20230926050719/https://en.example.org/cultnatlaws/list',
    )

    expect(unwrapUnescoWebArchive(url)).toBe('https://en.example.org/cultnatlaws/list')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://webarchive.unesco.org/web/20230104165710/https://en.example.org/themes/gender?page=2#coverage',
    )

    expect(unwrapUnescoWebArchive(url)).toBe('https://en.example.org/themes/gender?page=2#coverage')
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://webarchive.unesco.org/web/20230926050719/')

    expect(unwrapUnescoWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://webarchive.unesco.org/web/20230926050719/ftp://example.org/file.txt',
    )

    expect(unwrapUnescoWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://webarchive.unesco.org/search/20230926050719/https://en.example.org/',
    )

    expect(unwrapUnescoWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://whc.unesco.org/web/20230926050719/https://en.example.org/')

    expect(unwrapUnescoWebArchive(url)).toBeUndefined()
  })
})
