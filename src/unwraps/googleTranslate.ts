import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const googleTranslateHostRegex = /^translate\.google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/

const googleTranslatePaths = ['/translate', '/website']

// Google Translate (translate.google.<TLD>/translate?u=<target> and /website?u=<target>), and
// the translated frame it serves (translate.googleusercontent.com/translate_c?u=<target>).
// Not included in defaultUnwrappers: Google Translate renders the target translated, so
// unwrapping discards the translation the user wanted. Opt in by passing a custom unwrappers array.
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
