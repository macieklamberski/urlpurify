import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Fortinet FortiMail URL click protection on any host
// (<gateway host>/fmlurlsvc/?fewReq=<token>&url=<target>).
// Opt-in: an email security gateway, like Outlook Safe Links. Customers run it on their own hosts.
export const unwrapFortimail: UrlUnwrapper = (url) => {
  if (url.pathname !== '/fmlurlsvc/' || !url.searchParams.has('fewReq')) {
    return
  }

  const target = url.searchParams.get('url')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
