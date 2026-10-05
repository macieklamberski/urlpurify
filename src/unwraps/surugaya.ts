import { createParamExtractor } from '../utils.js'

// Suruga-ya affiliate redirect (affiliate.suruga-ya.jp/modules/af/af_jump.php?user_id=<id>&
// goods_url=<target>). Opt-in: unwrapping drops the publisher's commission.
export const unwrapSurugaya = createParamExtractor({
  hosts: 'affiliate.suruga-ya.jp',
  path: '/modules/af/af_jump.php',
  params: ['goods_url'],
})
