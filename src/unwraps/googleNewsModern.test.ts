import { describe, expect, it } from 'bun:test'
import { unwrapGoogleNewsModern } from './googleNewsModern.js'

const base64PlusRegex = /\+/g
const base64SlashRegex = /\//g
const base64PaddingRegex = /=+$/

const buildArticleId = (sourceUrl: string): string => {
  const urlBytes = Buffer.from(sourceUrl, 'utf8')
  const payload = Buffer.concat([
    Buffer.from([0x08, 0x13, 0x22, urlBytes.length]),
    urlBytes,
    Buffer.from([0xd2, 0x01, 0x00]),
  ])
  return payload
    .toString('base64')
    .replace(base64PlusRegex, '-')
    .replace(base64SlashRegex, '_')
    .replace(base64PaddingRegex, '')
}

describe('unwrapGoogleNewsModern', () => {
  it('should decode target from /articles/<base64> path', () => {
    const id = buildArticleId('https://example.com/article')
    const url = new URL(`https://news.google.com/articles/${id}`)

    expect(unwrapGoogleNewsModern(url)).toBe('https://example.com/article')
  })

  it('should decode target from /rss/articles/<base64> path', () => {
    const id = buildArticleId('https://example.com/article')
    const url = new URL(`https://news.google.com/rss/articles/${id}`)

    expect(unwrapGoogleNewsModern(url)).toBe('https://example.com/article')
  })

  it('should return undefined when the id lacks framing bytes', () => {
    const id = Buffer.from('hello world', 'utf8')
      .toString('base64')
      .replace(base64PlusRegex, '-')
      .replace(base64SlashRegex, '_')
      .replace(base64PaddingRegex, '')
    const url = new URL(`https://news.google.com/articles/${id}`)

    expect(unwrapGoogleNewsModern(url)).toBeUndefined()
  })

  it('should return undefined for non-articles paths', () => {
    const url = new URL('https://news.google.com/foryou')

    expect(unwrapGoogleNewsModern(url)).toBeUndefined()
  })

  it('should return undefined for non-Google-News hosts', () => {
    const id = buildArticleId('https://example.com/article')
    const url = new URL(`https://example.com/articles/${id}`)

    expect(unwrapGoogleNewsModern(url)).toBeUndefined()
  })

  it('should return undefined for malformed base64 ids', () => {
    const url = new URL('https://news.google.com/articles/not-valid-base64')

    expect(unwrapGoogleNewsModern(url)).toBeUndefined()
  })
})
