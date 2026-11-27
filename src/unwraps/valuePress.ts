import { decodeBase64, isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getBase64Target } from '../utils.js'

const decodeTwice = (value: string): string | undefined => {
  const decodedOnce = decodeBase64(value)

  if (!decodedOnce) {
    return
  }

  return decodeBase64(decodedOnce)
}

// value press release click counter (www.value-press.com/bin/tools/link_counter?a=<id>&l=<base64>).
// The l param is the target url base64-encoded twice.
export const unwrapValuePress: UrlUnwrapper = createUnwrapper({
  hosts: 'www.value-press.com',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/bin/tools/link_counter')) {
      return
    }

    return getBase64Target(url, 'l', decodeTwice)
  },
})
