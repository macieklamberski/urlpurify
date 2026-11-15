import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['bufferapp.com', 'www.bufferapp.com', 'buffer.com', 'www.buffer.com']
const composeHosts = ['publish.buffer.com']

const addPathRegex = /^\/add\/?$/i
const composePathRegex = /^\/compose$/i

const isCarrierPath = (url: URL): boolean => {
  if (isHostOf(url, hosts)) {
    return isAnyOf(url.pathname, addPathRegex)
  }

  if (isHostOf(url, composeHosts)) {
    return isAnyOf(url.pathname, composePathRegex)
  }

  return false
}

// Buffer share form (bufferapp.com/add?url=<page>, also buffer.com/add, their www. hosts and
// publish.buffer.com/compose, where /add redirects). Opt-in: unwrapping returns the shared page,
// not the form that queues it.
export const unwrapBuffer: UrlUnwrapper = (url) => {
  if (!isCarrierPath(url)) {
    return
  }

  // The `text=` and `title=` beside it are the post's message, even when they hold only a url.
  return getParamTarget(url, 'url')
}
