import { createQueryUnwrapper } from '../utils.js'

const clickPathRegex = /^\/r\/e\/[A-Za-z0-9]+$/i

// Saleshandy email click tracker (go.shztrk.com/r/e/<id>?r=<target>, also on go.shetrk.com,
// link.shetrk.com and numbered lc<n>.shztrk.com, lc<n>.shatrk.com and lc<n>.shetrk.com hosts).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapSaleshandy = createQueryUnwrapper({
  subdomains: ['shatrk.com', 'shetrk.com', 'shztrk.com'],
  match: /^(?:go\.sh[ez]trk|link\.shetrk|lc\d+\.sh[aez]trk)\.com$/,
  path: clickPathRegex,
  params: ['r'],
})
