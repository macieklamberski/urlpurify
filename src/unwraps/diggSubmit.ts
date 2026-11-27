import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['digg.com', 'www.digg.com']

const pathRegex = /^\/(?:submit|share|tools\/diggthis\/login)\/?$/i

// Digg submit and share links (digg.com/submit?phase=2&url=<target>, /share?url=,
// /tools/diggthis/login?url=, on digg.com and www.digg.com). Opt-in: unwrapping returns the shared
// page, not the form that submits it.
export const unwrapDiggSubmit: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    // The `title=`, `bodytext=` and `topic=` beside it are the story's text, never its target.
    return readParamTarget(url, 'url')
  },
})
