import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url, getUtf8ByteLength } from '../utils.js'

const v3PathRegex = /^\/v3\/__(.+)__;([^!]*)!/

const v3HostSet = new Set(['urldefense.com', 'urldefense.proofpoint.com', 'urldefense.us'])

// `**X` runs replace a fixed byte count: A=2, B=3, ... `_`=65.
const runLengthMap: Record<string, number> = (() => {
  const map: Record<string, number> = {}
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  for (let index = 0; index < alphabet.length; index += 1) {
    map[alphabet[index]] = index + 2
  }
  return map
})()

const decodeReplacements = (mangled: string, replacementBase64: string): string | undefined => {
  if (replacementBase64.length === 0) {
    return mangled
  }

  const replacement = decodeBase64Url(replacementBase64)

  if (replacement === undefined) {
    return
  }

  const replacementChars = Array.from(replacement)
  const urlChars = Array.from(mangled)
  const result: Array<string> = []
  const matcher = /(?<!\*)\*(?!\*)|\*{2}[A-Za-z0-9\-_]/g

  let lastIndex = 0
  let savedBytes = 0
  let match: RegExpExecArray | null

  match = matcher.exec(mangled)
  while (match !== null) {
    const startChar = positionInChars(mangled, match.index)
    const endChar = positionInChars(mangled, match.index + match[0].length)

    for (let charIndex = lastIndex; charIndex < startChar; charIndex += 1) {
      result.push(urlChars[charIndex])
    }

    if (match[0] === '*') {
      const next = replacementChars.shift()
      if (next === undefined) {
        return
      }
      result.push(next)
    } else {
      let bytesToReplace = runLengthMap[match[0][2]]
      if (savedBytes !== 0) {
        bytesToReplace += savedBytes
        savedBytes = 0
      }

      let bytesConsumed = 0
      while (bytesConsumed < bytesToReplace) {
        const next = replacementChars.shift()
        if (next === undefined) {
          return
        }
        result.push(next)
        bytesConsumed += getUtf8ByteLength(next)

        if (replacementChars.length > 0) {
          const peekSize = getUtf8ByteLength(replacementChars[0])
          if (peekSize > bytesToReplace - bytesConsumed) {
            savedBytes = bytesToReplace - bytesConsumed
            bytesConsumed += savedBytes
          }
        }
      }
    }

    lastIndex = endChar
    match = matcher.exec(mangled)
  }

  for (let charIndex = lastIndex; charIndex < urlChars.length; charIndex += 1) {
    result.push(urlChars[charIndex])
  }

  return result.join('')
}

// Convert a byte/code-unit offset from the source string into an index into
// the array-of-code-points view. Mangled v3 segments are ASCII-only at the
// `*` markers, so this is effectively the identity but keeps the algorithm
// safe for any embedded multi-byte literals in the URL itself.
const positionInChars = (source: string, codeUnitIndex: number): number => {
  let charIndex = 0
  let unit = 0
  while (unit < codeUnitIndex && unit < source.length) {
    const codePoint = source.codePointAt(unit)
    unit += codePoint !== undefined && codePoint > 0xffff ? 2 : 1
    charIndex += 1
  }
  return charIndex
}

// Proofpoint URLDefense v3 (urldefense.com/v3/__<mangled>__;<b64>!!<sig>$).
// `*` characters in the mangled URL are restored from the base64 segment;
// `**X` runs restore a fixed byte count (A=2 through `_`=65).
export const unwrapProofpointV3: UrlUnwrapper = (url) => {
  if (!v3HostSet.has(url.hostname)) {
    return
  }

  const match = `${url.pathname}${url.search}`.match(v3PathRegex)
  if (!match) {
    return
  }

  return decodeReplacements(match[1], match[2])
}
