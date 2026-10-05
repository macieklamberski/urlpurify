import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/r\/e\/[A-Za-z0-9]+$/

const extractTarget = createParamExtractor({
  hosts: /^(?:go\.shztrk|lc\d+\.sh[az]trk)\.com$/,
  params: ['r'],
})

// Saleshandy email click tracker (go.shztrk.com/r/e/<id>?r=<target>, also on numbered
// lc<n>.shztrk.com and lc<n>.shatrk.com hosts). Opt-in: unwrapping removes the click count.
export const unwrapSaleshandy: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
