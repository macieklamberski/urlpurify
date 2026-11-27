import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractChecklink = createQueryUnwrapper({
  hosts: 'checklink.mail.ru',
  path: '/proxy',
  params: ['url'],
})

const extractClick = createQueryUnwrapper({
  hosts: ['click.mail.ru', 'click.my.mail.ru'],
  path: '/redir',
  params: ['u'],
})

// Mail.ru webmail link checker (checklink.mail.ru/proxy?es=<sig>&egid=<sig>&url=<target>) and
// click redirect (click.mail.ru/redir?u=<target>&s=<sig>, also click.my.mail.ru).
export const unwrapMailRu = createUnwrapper({
  hosts: ['checklink.mail.ru', 'click.mail.ru', 'click.my.mail.ru'],
  unwrap: (url) => {
    return extractChecklink(url) ?? extractClick(url)
  },
})
