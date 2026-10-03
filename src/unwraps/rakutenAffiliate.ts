import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// hbb.afl.rakuten.co.jp/hgb/ carries `pc` too, but as an `<img src>` banner whose `pc` is the
// thumbnail, not a destination.
const linkShapes = [
  { host: 'hb.afl.rakuten.co.jp', pathRegex: /^\/(?:hgc|ichiba)\// },
  { host: 'pt.afl.rakuten.co.jp', pathRegex: /^\/c\// },
  { host: 'mt.afl.rakuten.co.jp', pathRegex: /^\/mc\// },
]

const targetParams = ['pc', 'url']

// Rakuten Japan affiliate redirect (hb.afl.rakuten.co.jp/{hgc,ichiba}/<ids>/?pc=<target>,
// {pt.afl.rakuten.co.jp/c,mt.afl.rakuten.co.jp/mc}/<ids>/?url=<target>). Not included in
// defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapRakutenAffiliate: UrlUnwrapper = (url) => {
  const isLink = linkShapes.some((shape) => {
    return isHostOf(url, shape.host) && shape.pathRegex.test(url.pathname)
  })

  if (!isLink) {
    return
  }

  for (const param of targetParams) {
    const value = url.searchParams.get(param)

    if (value) {
      return value
    }
  }
}
