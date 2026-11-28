import { createPathUnwrapper } from '../pathTarget.js'

// A 14-digit timestamp after the replay prefix.
const prefixRegex = /^\/wayback\/\d{14}\//i

// Arquivo.pt, the Portuguese web archive, snapshot (arquivo.pt/wayback/<timestamp>/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapArquivo = createPathUnwrapper({
  hosts: ['arquivo.pt', 'www.arquivo.pt'],
  prefix: prefixRegex,
})
