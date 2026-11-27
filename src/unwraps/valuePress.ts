import { decodeBase64 } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

const decodeTwice = (value: string): string | undefined => {
  const decodedOnce = decodeBase64(value)

  if (!decodedOnce) {
    return
  }

  return decodeBase64(decodedOnce)
}

// value press release click counter (www.value-press.com/bin/tools/link_counter?a=<id>&l=<base64>).
// The l param is the target url base64-encoded twice.
export const unwrapValuePress = createQueryUnwrapper({
  hosts: 'www.value-press.com',
  path: '/bin/tools/link_counter',
  params: ['l'],
  decode: decodeTwice,
})
