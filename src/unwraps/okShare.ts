import { getQueryParam, isAnyOf, isHostOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['odnoklassniki.ru', 'www.odnoklassniki.ru', 'ok.ru', 'www.ok.ru']
const connectHosts = ['connect.ok.ru']
const widgetCommands = ['WidgetShare', 'WidgetSharePreview']

// OK.ru share (ok.ru/dk?st.cmd=addShare&st._surl=<target>, also on odnoklassniki.ru, and
// connect.ok.ru/offer?url= and /dk?st.cmd=WidgetShare or WidgetSharePreview with st.shareUrl=).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapOkShare = createUnwrapper({
  hosts: [...hosts, ...connectHosts],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    // `/dk` serves every OK.ru action, such as the `logExternal` link shim, so the command decides.
    const command = getQueryParam(url, 'st.cmd')

    if (isHostOf(url, hosts)) {
      if (isAnyOf(url.pathname, '/dk') && isAnyOf(command, 'addShare')) {
        return readParamTarget(url, 'st._surl')
      }

      return
    }

    if (isAnyOf(url.pathname, '/offer')) {
      return readParamTarget(url, 'url')
    }

    if (isAnyOf(url.pathname, '/dk') && isAnyOf(command, widgetCommands)) {
      return readParamTarget(url, 'st.shareUrl')
    }
  },
})
