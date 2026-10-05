import { createParamExtractor } from '../utils.js'

// Button affiliate link redirect (r.bttn.io/?btn_url=<target>&btn_ref=org-<id>, also the custom
// domains r.amzlink.to and r.nypostlink.com). Opt-in: unwrapping drops the publisher's commission.
export const unwrapButton = createParamExtractor({
  hosts: ['r.amzlink.to', 'r.bttn.io', 'r.nypostlink.com'],
  path: '/',
  params: ['btn_url'],
})
