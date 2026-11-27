import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['technorati.com', 'www.technorati.com']

const pathRegex = /^\/faves(?:\/[^/]*)?$/i

// Technorati add-to-faves button (technorati.com/faves?add=<page>, /faves/ and /faves/<user>,
// with or without sub=addfavbtn, on bare and www.technorati.com). Opt-in: unwrapping returns the
// faved page, not the form that faves it.
export const unwrapTechnoratiFaves: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return readParamTarget(url, 'add')
  },
})
