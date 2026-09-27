import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const feedsportalPathRegex = /\/([0-9A-Za-z]{20,})\/story01\.htm$/

// FeedSportal-encoded article links (<host>/<encoded-id>/story01.htm). The
// id uses '0' as a digraph prefix; each '0X' (X = A-Z) decodes to a fixed
// substitution. FeedSportal shut down around 2016 but archived feeds still
// contain these wrappers.
const feedsportalAlphabet: Record<string, string> = {
  A: '0',
  B: '.',
  C: '/',
  D: '?',
  E: '-',
  F: '=',
  G: '&',
  H: ',',
  I: '_',
  J: '%',
  K: '+',
  L: 'http://',
  M: 'https://',
  N: '.com',
  O: '.co.uk',
  P: ';',
  Q: '|',
  R: ':',
  S: 'www.',
  T: '#',
  U: '$',
  V: '~',
  W: '!',
  X: '(',
  Y: ')',
  Z: 'Z',
}

export const unwrapFeedsportal: UrlUnwrapper = (url) => {
  const match = url.pathname.match(feedsportalPathRegex)
  if (!match) {
    return
  }

  const decoded = match[1]
    .split('0')
    .map((chunk, index) => {
      if (index === 0) {
        return chunk
      }
      const head = chunk[0]
      const substitution = head ? feedsportalAlphabet[head] : undefined
      return substitution === undefined ? `0${chunk}` : substitution + chunk.slice(1)
    })
    .join('')

  if (!isHttpUrl(decoded)) {
    return
  }

  return decoded
}
