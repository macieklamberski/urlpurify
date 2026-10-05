import { describe, expect, it } from 'bun:test'
import { unwrapHearthis } from './hearthis.js'

describe('unwrapHearthis', () => {
  it('should extract the target from the link shim', () => {
    const url = new URL('https://app.hearthis.at/l.php?url=http://www.example.com/')

    expect(unwrapHearthis(url)).toBe('http://www.example.com/')
  })

  it('should extract an encoded target on the bare host', () => {
    const url = new URL(
      'https://hearthis.at/l.php?url=https%3A%2F%2Fplay.example.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.example.game',
    )

    expect(unwrapHearthis(url)).toBe(
      'https://play.example.com/store/apps/details?id=com.example.game',
    )
  })

  it('should return undefined for the link shim without url', () => {
    const url = new URL('https://hearthis.at/l.php')

    expect(unwrapHearthis(url)).toBeUndefined()
  })

  it('should return undefined for the player page', () => {
    const url = new URL('https://hearthis.at/p.php?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapHearthis(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/l.php?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapHearthis(url)).toBeUndefined()
  })
})
