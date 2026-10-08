import type { UrlUnwrapper } from '../types.js'
import { getParamTarget, percentDecode } from '../utils.js'

const hostRegex = /^(?:[a-z0-9-]+-dot-)?yamm-track\.appspot\.com$/
const encodedSchemeRegex = /^https?%3A/i

// Yet Another Mail Merge click tracker (<sender>-dot-yamm-track.appspot.com/Redirect?link=<target>,
// also the bare yamm-track.appspot.com). App Engine routes every `<label>-dot-` host to the same
// app. Opt-in: unwrapping removes the sender's click count.
export const unwrapYamm: UrlUnwrapper = (url) => {
  if (!hostRegex.test(url.hostname) || url.pathname !== '/Redirect') {
    return
  }

  // An unencoded nested tracker repeats `link`, so the first value is a stub and the last one is
  // the target.
  const value = getParamTarget(url, 'link', -1)

  if (!value) {
    return
  }

  if (!encodedSchemeRegex.test(value)) {
    return value
  }

  // A target encoded twice still holds an encoded scheme after one decode.
  return percentDecode(value)
}
