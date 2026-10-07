import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { percentDecode } from '../utils.js'

const encodedSchemeRegex = /^https?%3A/i

// The target sits percent-encoded once or twice in one segment, between the campaign id and the
// recipient's id and email address.
const clickPathRegex =
  /^\/Click\/AddCampaignEmailClick\/[0-9a-f-]{36}\/([^/]+)\/[0-9a-f-]{36}\/[^/]+\/(?:True|False)$/

// CSE360 email click tracker
// (click.cse360.com.br/Click/AddCampaignEmailClick/<id>/<target>/<id>/<email>/<True|False>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapCse360: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'click.cse360.com.br')) {
    return
  }

  const match = clickPathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  try {
    let target = decodeURIComponent(match[1])

    if (encodedSchemeRegex.test(target)) {
      target = percentDecode(target)
    }

    if (isHttpUrl(target)) {
      return target
    }
  } catch {}
}
