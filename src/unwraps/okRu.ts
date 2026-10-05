import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractLogExternalLink = createParamExtractor({
  hosts: ['ok.ru', 'www.ok.ru', 'odnoklassniki.ru', 'www.odnoklassniki.ru'],
  path: '/dk',
  params: ['st.link'],
})

const extractOutLinkWarningTarget = createParamExtractor({
  hosts: ['m.ok.ru', 'm.odnoklassniki.ru'],
  path: '/dk',
  params: ['st.rfn'],
})

// OK.ru outbound link (ok.ru/dk?cmd=logExternal&st.link=<target>) and its mobile leaving-site
// page (m.ok.ru/dk?st.cmd=outLinkWarning&st.rfn=<target>), also on odnoklassniki.ru.
export const unwrapOkRu: UrlUnwrapper = (url) => {
  // `/dk` serves every OK.ru action, such as the `addShare` share intent, so the command decides.
  if (url.searchParams.get('cmd') === 'logExternal') {
    return extractLogExternalLink(url)
  }

  if (url.searchParams.get('st.cmd') === 'outLinkWarning') {
    return extractOutLinkWarningTarget(url)
  }
}
