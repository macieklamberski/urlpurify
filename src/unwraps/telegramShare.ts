import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const pathRegex = /^\/share(?:\/url)?\/?$/i

const hosts = ['t.me', 'telegram.me']

// Telegram share (t.me/share/url?url=<target>, also /share, on t.me and telegram.me). Opt-in:
// unwrapping returns the shared page, not the share dialog.
export const unwrapTelegramShare: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `text=` beside it is the message, even when it holds only a url.
  return getParamTarget(url, 'url')
}
