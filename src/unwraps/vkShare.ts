import { createParamExtractor } from '../utils.js'

// VK share (vk.com/share.php?url=<page>, also on vk.ru, the www. and new. hosts, and the old
// vkontakte.ru). The title=, description=, image= and comment= beside it never carry the page.
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapVkShare = createParamExtractor({
  hosts: [
    'vk.com',
    'www.vk.com',
    'new.vk.com',
    'vk.ru',
    'www.vk.ru',
    'vkontakte.ru',
    'www.vkontakte.ru',
  ],
  path: '/share.php',
  params: ['url'],
})
