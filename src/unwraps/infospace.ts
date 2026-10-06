import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// InfoSpace metasearch result click behind Dogpile, WebCrawler and others
// (click.infospace.com/ClickHandler.ashx?du=<display url>&ru=<target>, also on the ccs., cs. and
// dsclick. hosts). `du` is only the display url, sometimes without a scheme, so `ru` is read.
export const unwrapInfospace: UrlUnwrapper = createParamExtractor({
  hosts: ['click.infospace.com', 'ccs.infospace.com', 'cs.infospace.com', 'dsclick.infospace.com'],
  path: '/ClickHandler.ashx',
  params: ['ru'],
})
