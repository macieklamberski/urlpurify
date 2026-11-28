import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/faves(?:\/[^/]*)?$/i

// Technorati add-to-faves button (technorati.com/faves?add=<page>, /faves/ and /faves/<user>, with
// or without sub=addfavbtn, on bare and www.technorati.com).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapTechnoratiFaves = createUnwrapper({
  hosts: ['technorati.com', 'www.technorati.com'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return readParamTarget(url, 'add')
  },
})
