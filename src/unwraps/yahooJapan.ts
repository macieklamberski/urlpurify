import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url } from '../utils.js'

const hosts = ['rdsig.yahoo.co.jp', 'ord.yahoo.co.jp']
const pathRegex = /^(?:\/[^/]+)*\/RU=([\w-]+)(?:\/R[A-Z]=[^/]*)*(?:;.*)?$/
const paddingRegex = /-+$/

// Yahoo! JAPAN click redirect (rdsig.yahoo.co.jp/.../RV=1/RU=<base64url target>/RS=..., also
// ord.yahoo.co.jp/o/...). The target ends the path or comes before /RK=, /RS= or ;_ylt=.
export const unwrapYahooJapan: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // Yahoo! JAPAN pads the base64url target with `-` in place of `=`.
  let target = decodeBase64Url(match[1].replace(paddingRegex, ''))

  // RV=2 links end the target with a NUL byte.
  if (target?.endsWith('\0')) {
    target = target.slice(0, -1)
  }

  if (target && isHttpUrl(target)) {
    return target
  }
}
