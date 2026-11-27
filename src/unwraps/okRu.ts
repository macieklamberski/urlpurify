import { getQueryParam } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractLogExternalLink = createQueryUnwrapper({
  hosts: ['ok.ru', 'www.ok.ru', 'odnoklassniki.ru', 'www.odnoklassniki.ru'],
  path: '/dk',
  params: ['st.link'],
})

const extractOutLinkWarningTarget = createQueryUnwrapper({
  hosts: ['m.ok.ru', 'm.odnoklassniki.ru'],
  path: '/dk',
  params: ['st.rfn'],
})

// OK.ru outbound link (ok.ru/dk?cmd=logExternal&st.link=<target>) and its mobile leaving-site
// page (m.ok.ru/dk?st.cmd=outLinkWarning&st.rfn=<target>), also on odnoklassniki.ru.
export const unwrapOkRu = createUnwrapper({
  hosts: [
    'ok.ru',
    'www.ok.ru',
    'odnoklassniki.ru',
    'www.odnoklassniki.ru',
    'm.ok.ru',
    'm.odnoklassniki.ru',
  ],
  unwrap: (url) => {
    // `/dk` serves every OK.ru action, such as the `addShare` share intent, so the command decides.
    if (getQueryParam(url, 'cmd') === 'logExternal') {
      return extractLogExternalLink(url)
    }

    if (getQueryParam(url, 'st.cmd') === 'outLinkWarning') {
      return extractOutLinkWarningTarget(url)
    }
  },
})
