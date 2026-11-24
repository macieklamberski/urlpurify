import { createParamExtractor } from '../utils.js'

// Tencent Qzone share form (sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=<page>). Opt-in
// in the share intent group: the link opens Qzone's post form with the page attached, it never
// redirects to it. The `title=` and `summary=` beside it are free text.
export const unwrapQzoneShare = createParamExtractor({
  hosts: 'sns.qzone.qq.com',
  path: '/cgi-bin/qzshare/cgi_qzshare_onekey',
  params: ['url'],
  ignoreLinkFragment: true,
})
