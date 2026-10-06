import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const linkPathRegex = /^\/[0-9a-f]{16}\/$/

const extractTarget = createParamExtractor({
  hosts: [
    'landsurveyorsunited.visibli.com',
    'magpiesrecipes.visibli.com',
    'theblacklist.visibli.com',
  ],
  params: ['dst'],
})

// Visibli framed share link (<user>.visibli.com/<16 hex>/?web=<id>&dst=<target>). Visibli closed,
// and captures from 2011 show the link forwarding to the target.
export const unwrapVisibli: UrlUnwrapper = (url) => {
  if (!linkPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
