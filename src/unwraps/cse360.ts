import { decodePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// The target sits percent-encoded once or twice, or raw without its scheme, in one segment, between
// the campaign id and the recipient's id and email address.
const clickPathRegex =
  /^\/Click\/AddCampaignEmailClick\/[0-9a-f-]{36}\/([^/]+)\/[0-9a-f-]{36}\/[^/]+\/(?:True|False)$/i

// CSE360 email click tracker
// (click.cse360.com.br/Click/AddCampaignEmailClick/<id>/<target>/<id>/<email>/<True|False>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapCse360: UrlUnwrapper = createUnwrapper({
  hosts: 'click.cse360.com.br',
  unwrap: (url) => {
    const match = clickPathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    return decodePathTarget(match[1])
  },
})
