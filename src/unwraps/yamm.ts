import { createQueryUnwrapper } from '../utils.js'

// Yet Another Mail Merge click tracker (<sender>-dot-yamm-track.appspot.com/Redirect?link=<target>,
// also the bare yamm-track.appspot.com). App Engine routes every `<label>-dot-` host to the same
// app.
// Opt-in: unwrapping removes the sender's click count.
export const unwrapYamm = createQueryUnwrapper({
  subdomains: 'appspot.com',
  match: /^(?:[a-z0-9-]+-dot-)?yamm-track\.appspot\.com$/,
  path: '/Redirect',
  params: ['link'],
  // An unencoded nested tracker repeats `link`, so the first value is a stub and the last one is
  // the target.
  index: -1,
})
