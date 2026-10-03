import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// translate.google.<TLD> and every subdomain. The frame host matches exactly: googleusercontent.com
// gives third parties subdomains, such as Apps Script web apps.
const googleTranslateHostRegex = /(?:^|\.)translate\.google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/

const googleTranslatePaths = ['/translate', '/website']

// Google Translate ([*.]translate.google.<TLD>/translate?u=<target> and /website?u=<target>),
// and its translated frame (translate.googleusercontent.com/translate_c?u=<target>). Opt-in:
// it renders the target translated, so unwrapping discards the translation the user wanted.
export const unwrapGoogleTranslate: UrlUnwrapper = (url) => {
  const isTranslatePage =
    isAnyOf(url.hostname, googleTranslateHostRegex) && googleTranslatePaths.includes(url.pathname)
  const isTranslateFrame =
    isHostOf(url, 'translate.googleusercontent.com') && url.pathname === '/translate_c'

  if (!isTranslatePage && !isTranslateFrame) {
    return
  }

  const target = url.searchParams.get('u')

  if (!target) {
    return
  }

  return target
}
