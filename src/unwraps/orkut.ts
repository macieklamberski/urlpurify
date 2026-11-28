import { createQueryUnwrapper } from '../utils.js'

// Orkut leaving-site interstitial (www.orkut.com.br/Interstitial?u=<target>&t=<token>, also on
// orkut.com and orkut.co.in).
// Opt-in: the shim's page needs a sign-in, which unwrapping skips. The page needed an Orkut
// sign-in, and the service is closed.
export const unwrapOrkut = createQueryUnwrapper({
  hosts: [
    'orkut.co.in',
    'www.orkut.co.in',
    'orkut.com',
    'www.orkut.com',
    'orkut.com.br',
    'www.orkut.com.br',
  ],
  path: '/Interstitial',
  params: ['u'],
})
