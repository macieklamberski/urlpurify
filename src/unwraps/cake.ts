import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

// CAKE affiliate click on any host (<tracking host>/?a=<affiliate>&c=<creative>&ckmrdr=<target>).
// Opt-in: unwrapping removes the publisher's commission. Networks and advertisers run it on their
// own hosts.
export const unwrapCake: UrlUnwrapper = (url) => {
  if (url.pathname !== '/' || !url.searchParams.has('a') || !url.searchParams.has('c')) {
    return
  }

  const target = getParamTarget(url, 'ckmrdr')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
