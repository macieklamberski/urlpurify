import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['technorati.com', 'www.technorati.com']

const pathRegex = /^\/faves(?:\/[^/]*)?$/i

// Technorati add-to-faves button (technorati.com/faves?add=<page>, /faves/ and /faves/<user>,
// with or without sub=addfavbtn, on bare and www.technorati.com). Opt-in: unwrapping returns the
// faved page, not the form that faves it.
export const unwrapTechnoratiFaves: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  return getParamTarget(url, 'add')
}
