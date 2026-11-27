import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const paths = ['/disclaimer', '/docs/link-disclaimer']

const extractTarget = createQueryUnwrapper({
  hosts: 'help.sap.com',
  params: ['site'],
})

// SAP Help Portal leaving-site page (help.sap.com/docs/link-disclaimer?site=<target>, also
// /disclaimer). The page names the target and links on to it.
export const unwrapSapHelp: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.pathname, paths)) {
    return
  }

  return extractTarget(url)
}
