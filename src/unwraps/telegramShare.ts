import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

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
// telegram.me, telegram.dog and their www. hosts).
// Opt-in: unwrapping returns the shared page, not the share dialog.
export const unwrapTelegramShare = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    // The `text=` beside it is the message, even when it holds only a url.
    return readParamTarget(url, 'url')
  },
})
