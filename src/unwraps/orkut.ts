import { createQueryUnwrapper } from '../utils.js'

// Orkut leaving-site interstitial (www.orkut.com.br/Interstitial?u=<target>&t=<token>, also on
// orkut.com and orkut.co.in). Opt-in: the page needed an Orkut sign-in, and the service is closed.
export const unwrapOrkut = createQueryUnwrapper({
  hosts: [
    'www.orkut.co.in',
    'orkut.co.in',
    'www.orkut.com',
    'orkut.com',
    'www.orkut.com.br',
    'orkut.com.br',
  ],
  path: '/Interstitial',
  params: ['u'],
})
