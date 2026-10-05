import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const paths = ['/disclaimer', '/docs/link-disclaimer']

const extractTarget = createParamExtractor({
  hosts: 'help.sap.com',
  params: ['site'],
})

// SAP Help Portal leaving-site page (help.sap.com/docs/link-disclaimer?site=<target>, also
// /disclaimer). The page names the target and links on to it.
export const unwrapSapHelp: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname)) {
    return
  }

  return extractTarget(url)
}
