import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64 } from '../utils.js'

const baseExtractor = createParamExtractor({
  hosts: 'www.value-press.com',
  path: '/bin/tools/link_counter',
  params: ['l'],
})

// value press release click counter (www.value-press.com/bin/tools/link_counter?a=<id>&l=<base64>).
// The l param is the target url base64-encoded twice.
export const unwrapValuePress: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  const decodedOnce = decodeBase64(raw)

  if (!decodedOnce) {
    return
  }

  const target = decodeBase64(decodedOnce)

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
