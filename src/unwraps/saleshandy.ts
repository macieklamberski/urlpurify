import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const clickPathRegex = /^\/r\/e\/[A-Za-z0-9]+$/i

const extractTarget = createQueryUnwrapper({
  hosts: /^(?:go\.sh[ez]trk|link\.shetrk|lc\d+\.sh[aez]trk)\.com$/,
  params: ['r'],
})

// Saleshandy email click tracker (go.shztrk.com/r/e/<id>?r=<target>, also on go.shetrk.com,
// link.shetrk.com and numbered lc<n>.shztrk.com, lc<n>.shatrk.com and lc<n>.shetrk.com hosts).
// Opt-in: unwrapping removes the click count.
export const unwrapSaleshandy = createUnwrapper({
  subdomains: ['shatrk.com', 'shetrk.com', 'shztrk.com'],
  unwrap: (url) => {
    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
