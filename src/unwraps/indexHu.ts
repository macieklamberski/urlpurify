import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, percentDecode } from '../utils.js'

const sectionParamRegex = /^index_[a-z]+_cikklink$/
const encodedSchemeRegex = /^https?%3A/i

const unwrapCounter = createParamExtractor({
  hosts: ['dex.hu', 'index.hu', 'vakbarat.index.hu'],
  path: '/x.php',
  params: ['url'],
})

const unwrapSectionCounter: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['dex.hu', 'index.hu']) || url.pathname !== '/x') {
    return
  }

  for (const [key, value] of url.searchParams) {
    if (!sectionParamRegex.test(key) || !value) {
      continue
    }

    if (!encodedSchemeRegex.test(value)) {
      return value
    }

    return percentDecode(value)
  }
}

// Index.hu and Dex.hu outbound link counter (index.hu/x.php?id=<id>&url=<target>), on dex.hu,
// index.hu and vakbarat.index.hu, and the section counter on dex.hu and index.hu that names the
// param after the section (index.hu/x?index_<section>_cikklink=<target>).
export const unwrapIndexHu: UrlUnwrapper = (url) => {
  return unwrapCounter(url) ?? unwrapSectionCounter(url)
}
