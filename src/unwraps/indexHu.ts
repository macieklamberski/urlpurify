import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper, readParamTarget } from '../utils.js'

const sectionParamRegex = /^index_[a-z]+_cikklink$/

const unwrapCounter = createQueryUnwrapper({
  hosts: ['dex.hu', 'index.hu', 'vakbarat.index.hu'],
  path: '/x.php',
  params: ['url'],
})

const unwrapSectionCounter = createUnwrapper({
  hosts: ['dex.hu', 'index.hu'],
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/x')) {
      return
    }

    for (const key of url.searchParams.keys()) {
      if (!sectionParamRegex.test(key)) {
        continue
      }

      const target = readParamTarget(url, key)

      if (target) {
        return target
      }
    }
  },
})

// Index.hu and Dex.hu outbound link counter (index.hu/x.php?id=<id>&url=<target>), on dex.hu,
// index.hu and vakbarat.index.hu, and the section counter on dex.hu and index.hu that names the
// param after the section (index.hu/x?index_<section>_cikklink=<target>).
export const unwrapIndexHu: UrlUnwrapper = (url) => {
  return unwrapCounter(url) ?? unwrapSectionCounter(url)
}
