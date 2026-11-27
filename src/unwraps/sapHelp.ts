import { createQueryUnwrapper } from '../utils.js'

// SAP Help Portal leaving-site page (help.sap.com/docs/link-disclaimer?site=<target>, also
// /disclaimer). The page names the target and links on to it.
export const unwrapSapHelp = createQueryUnwrapper({
  hosts: ['help.sap.com'],
  path: ['/disclaimer', '/docs/link-disclaimer'],
  params: ['site'],
})
