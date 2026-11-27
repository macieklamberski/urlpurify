import { createQueryUnwrapper } from '../utils.js'

const linkPathRegex = /^\/[0-9a-f]{16}\/$/

// Visibli framed share link (<user>.visibli.com/<16 hex>/?web=<id>&dst=<target>). Visibli closed,
// and captures from 2011 show the link forwarding to the target.
export const unwrapVisibli = createQueryUnwrapper({
  hosts: [
    'landsurveyorsunited.visibli.com',
    'magpiesrecipes.visibli.com',
    'theblacklist.visibli.com',
  ],
  path: linkPathRegex,
  params: ['dst'],
})
