import { decodeBase64Url } from 'trousse'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^(?:\/[^/]+)*\/RU=(?<encoded>[\w-]+)(?:\/R[A-Z]=[^/]*)*(?:;.*)?$/i

// Yahoo! JAPAN click redirect (rdsig.yahoo.co.jp/.../RV=1/RU=<base64url target>/RS=...). The
// target ends the path or comes before /RK=, /RS= or ;_ylt=.
export const unwrapYahooJapan = createUnwrapper({
  hosts: 'rdsig.yahoo.co.jp',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.encoded) {
      return
    }

    const encoded = match.groups.encoded
    let end = encoded.length

    // Yahoo! JAPAN pads the base64url target with `-` in place of `=`. A loop, since `/-+$/`
    // rescans the run from every `-` and takes quadratic time on a long one.
    while (end > 0 && encoded[end - 1] === '-') {
      end -= 1
    }

    const target = decodeBase64Url(encoded.slice(0, end))

    // RV=2 links end the target with a NUL byte.
    if (target?.endsWith('\0')) {
      return target.slice(0, -1)
    }

    return target
  },
})
