import { createQueryUnwrapper } from '../utils.js'

// VK away redirect (vk.com/away.php?to=<target>), also on vk.ru, the m. and new. hosts, and VK's
// old domain vkontakte.ru.
export const unwrapVkAway = createQueryUnwrapper({
  hosts: [
    'vk.com',
    'www.vk.com',
    'vk.ru',
    'www.vk.ru',
    'm.vk.com',
    'new.vk.com',
    'm.vk.ru',
    'vkontakte.ru',
    'www.vkontakte.ru',
  ],
  path: '/away.php',
  params: ['to'],
})
