import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapCloze } from './cloze.js'

describe('unwrapCloze', () => {
  it('should drop a space before the target host', () => {
    const value = 'https://circulate.it/r/abc/%20www.example.com/page'
    const expected = 'http://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapCloze] })).toBe(expected)
  })

  it('should extract a target with its scheme dropped', () => {
    const value = new URL(
      'https://circulate.it/r/VoMRdaDZJgWIXBtMV63opiU2H_wB_8w9SIQ9YMfa6foxvXcMGgzK_0JSXTtcLeN7/example.com/contact',
    )
    const expected = 'http://example.com/contact'

    expect(unwrapCloze(value)).toBe(expected)
  })

  it('should extract a target after the link text', () => {
    const value = new URL(
      'https://circulate.it/r/O62Bak8Z5Ls_AC-Nov38njmwAn4tJV4EievTmjAmMJ4tNi8zXHYBwW4j8rwMY_3NAvP6VQEEFF9O4I57lg3OXS6mpTU/n/QXN0ZXJpc2s/example.xyz/',
    )
    const expected = 'http://example.xyz/'

    expect(unwrapCloze(value)).toBe(expected)
  })

  it('should keep the query and fragment of a target', () => {
    const value = new URL(
      'https://circulate.it/r/t6-c7vRWH__qUWZ6UGDgzrduZ7xjz9SDk-xS23wGlnK73AlFIdg_1hi8H5hJw6mE/example.com/items/szxKhOr/?exchange=true&hssrc=2#top',
    )
    const expected = 'http://example.com/items/szxKhOr/?exchange=true&hssrc=2#top'

    expect(unwrapCloze(value)).toBe(expected)
  })

  it('should return undefined for a token with no target', () => {
    const value = new URL(
      'https://circulate.it/r/VoMRdaDZJgWIXBtMV63opiU2H_wB_8w9SIQ9YMfa6foxvXcMGgzK_0JSXTtcLeN7',
    )

    expect(unwrapCloze(value)).toBeUndefined()
  })

  it('should keep the wrapper for a target host that does not parse', () => {
    const value =
      'https://circulate.it/r/VoMRdaDZJgWIXBtMV63opiU2H_wB_8w9SIQ9YMfa6foxvXcMGgzK_0JSXTtcLeN7/example.com%2'

    expect(purifyUrl(value, { unwrappers: [unwrapCloze] })).toBe(value)
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://circulate.it/s/VoMRdaDZJgWIXBtM/example.com/contact')

    expect(unwrapCloze(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/r/VoMRdaDZJgWIXBtMV63opiU2H_wB_8w9SIQ9YMfa6foxvXcMGgzK_0JSXTtcLeN7/example.org/contact',
    )

    expect(unwrapCloze(value)).toBeUndefined()
  })
})
