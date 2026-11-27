import { decodeBase64UrlBinary } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { appendLinkFragment, createUnwrapper } from '../utils.js'

const articleIdRegex = /^\/(?:__i\/rss\/rd\/|rss\/)?articles\/([\w-]+)$/i
// Protobuf framing around the destination URL: 0x08 0x13 + length-prefixed
// string, terminated by 0xd2 0x01. Control bytes are part of the protocol.
// biome-ignore lint/suspicious/noControlCharactersInRegex: protobuf framing bytes
const protobufFramingRegex = /\x08\x13".+?(https?:\/\/[^\xd2]+)\xd2\x01/

// Google News modern article URLs (news.google.com/articles/<base64>, /rss/articles/<base64>, or
// the RSS redirect /__i/rss/rd/articles/<base64>). The article id is a base64url-encoded protobuf
// containing the destination URL between known framing bytes. Some ids (typically post-2023)
// require a server-side signature exchange and can only be resolved with a network call, those
// return undefined silently.
export const unwrapGoogleNewsModern: UrlUnwrapper = createUnwrapper({
  hosts: 'news.google.com',
  unwrap: (url) => {
    const match = url.pathname.match(articleIdRegex)
    if (!match) {
      return
    }

    const decoded = decodeBase64UrlBinary(match[1])
    const target = decoded?.match(protobufFramingRegex)?.[1]

    if (target) {
      return appendLinkFragment(target, url)
    }
  },
})
