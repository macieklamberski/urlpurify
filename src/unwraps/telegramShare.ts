import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const pathRegex = /^\/share(?:\/url|\/link\/add)?\/?$/i

const hosts = [
  't.me',
  'www.t.me',
  'telegram.me',
  'www.telegram.me',
  'telegram.dog',
  'www.telegram.dog',
]

// Telegram share (t.me/share/url?url=<target>, also /share and /share/link/add, on t.me,
// telegram.me, telegram.dog and their www. hosts). Opt-in: unwrapping returns the shared page, not
// the share dialog.
export const unwrapTelegramShare: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `text=` beside it is the message, even when it holds only a url.
  return getParamTarget(url, 'url')
}
