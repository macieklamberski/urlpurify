import { describe, expect, it } from 'bun:test'
import { unwrapCloze } from './cloze.js'

describe('unwrapCloze', () => {
  it('should extract a target with its scheme dropped', () => {
    const url = new URL(
      'https://circulate.it/r/VoMRdaDZJgWIXBtMV63opiU2H_wB_8w9SIQ9YMfa6foxvXcMGgzK_0JSXTtcLeN7/example.com/contact',
    )

    expect(unwrapCloze(url)).toBe('http://example.com/contact')
  })

  it('should extract a target after the contact name', () => {
    const url = new URL(
      'https://circulate.it/r/O62Bak8Z5Ls_AC-Nov38njmwAn4tJV4EievTmjAmMJ4tNi8zXHYBwW4j8rwMY_3NAvP6VQEEFF9O4I57lg3OXS6mpTU/n/QXN0ZXJpc2s/example.xyz/',
    )

    expect(unwrapCloze(url)).toBe('http://example.xyz/')
  })

  it('should keep the query and fragment of a target', () => {
    const url = new URL(
      'https://circulate.it/r/t6-c7vRWH__qUWZ6UGDgzrduZ7xjz9SDk-xS23wGlnK73AlFIdg_1hi8H5hJw6mE/example.com/items/szxKhOr/?exchange=true&hssrc=2#top',
    )

    expect(unwrapCloze(url)).toBe('http://example.com/items/szxKhOr/?exchange=true&hssrc=2#top')
  })

  it('should return undefined for a token with no target', () => {
    const url = new URL(
      'https://circulate.it/r/VoMRdaDZJgWIXBtMV63opiU2H_wB_8w9SIQ9YMfa6foxvXcMGgzK_0JSXTtcLeN7',
    )

    expect(unwrapCloze(url)).toBeUndefined()
  })

  it('should return undefined for a target host that does not parse', () => {
    const url = new URL(
      'https://circulate.it/r/VoMRdaDZJgWIXBtMV63opiU2H_wB_8w9SIQ9YMfa6foxvXcMGgzK_0JSXTtcLeN7/example.com%2',
    )

    expect(unwrapCloze(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://circulate.it/s/VoMRdaDZJgWIXBtM/example.com/contact')

    expect(unwrapCloze(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/r/VoMRdaDZJgWIXBtMV63opiU2H_wB_8w9SIQ9YMfa6foxvXcMGgzK_0JSXTtcLeN7/example.org/contact',
    )

    expect(unwrapCloze(url)).toBeUndefined()
  })
})
