import { createQueryUnwrapper } from '../utils.js'

// Mail.ru Mail link shim (e.mail.ru/cgi-bin/link?check=1&cnf=<id>&url=<target>, also on
// win.mail.ru, which forwards to e.mail.ru).
// Opt-in: the click needs a signed-in mailbox, and a reader without one lands on the login page.
export const unwrapMailRuLink = createQueryUnwrapper({
  hosts: ['e.mail.ru', 'win.mail.ru'],
  path: '/cgi-bin/link',
  params: ['url'],
})
