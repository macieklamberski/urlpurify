import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Binary, isHostOf } from '../utils.js'

const articleIdRegex = /^\/(?:rss\/)?articles\/([\w-]+)/
const base64UrlMinusRegex = /-/g
const base64UrlUnderscoreRegex = /_/g
// Protobuf framing around the destination URL: 0x08 0x13 + length-prefixed
// string, terminated by 0xd2 0x01. Control bytes are part of the protocol.
// biome-ignore lint/suspicious/noControlCharactersInRegex: protobuf framing bytes
const protobufFramingRegex = /\x08\x13".+?(https?:\/\/[^\xd2]+)\xd2\x01/

// Google News modern article URLs (news.google.com/articles/<base64> or
// /rss/articles/<base64>). The article id is a base64url-encoded protobuf
// containing the destination URL between known framing bytes. Some ids
// (typically post-2023) require a server-side signature exchange and can
// only be resolved with a network call, those return undefined silently.
export const unwrapGoogleNewsModern: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'news.google.com')) {
    return
  }

  const match = url.pathname.match(articleIdRegex)
  if (!match) {
    return
  }

  const padded = match[1].replace(base64UrlMinusRegex, '+').replace(base64UrlUnderscoreRegex, '/')
  const decoded = decodeBase64Binary(padded)
  const inner = decoded?.match(protobufFramingRegex)

  return inner?.[1]
}
