import { decodeBase64Url } from 'trousse'
import { createUnwrapper } from '../utils.js'

// A service that rewrites the link's query, such as govdelivery adding its own, escapes the `;` and
// `!` that close the mangled url as `%3B` and `%21`.
const v3PathRegex = /^\/v3\/__(?<encoded>.+)__(?:;|%3B)(?<replacements>[^!%]*)(?:!|%21)/i
const escapedMarkerRegex = /%2A/gi

const v3Hosts = [
  'urldefense.com',
  'www.urldefense.com',
  'urldefense.proofpoint.com',
  'urldefense.us',
  'www.urldefense.us',
]

const utf8Encoder = new TextEncoder()

const getUtf8ByteLength = (value: string): number => {
  return utf8Encoder.encode(value).length
}

// `**X` runs replace a fixed byte count: A=2, B=3, ... `_`=65.
const runLengthAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

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
  const markerRegex = /(?<!\*)\*(?!\*)|\*{2}[A-Za-z0-9\-_]/g

  let lastIndex = 0
  let savedBytes = 0
  let match: RegExpExecArray | null

  match = markerRegex.exec(mangled)
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
      let bytesToReplace = runLengthAlphabet.indexOf(match[0][2]) + 2
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
    match = markerRegex.exec(mangled)
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
// `*` and `**X` runs in the mangled URL are restored from the base64 segment.
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapProofpointV3 = createUnwrapper({
  hosts: v3Hosts,
  unwrap: (url) => {
    const match = v3PathRegex.exec(`${url.pathname}${url.search}`)
    if (!match?.groups) {
      return
    }

    // A rewritten query escapes the `*` markers along with the delimiters, and a raw `%` never
    // survives Proofpoint's own encoding, so `%2A` is always a marker.
    const target = decodeReplacements(
      match.groups.encoded.replace(escapedMarkerRegex, '*'),
      match.groups.replacements,
    )

    if (target) {
      return target
    }
  },
})
