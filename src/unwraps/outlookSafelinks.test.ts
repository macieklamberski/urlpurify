import { describe, expect, it } from 'bun:test'
import { unwrapOutlookSafelinks } from './outlookSafelinks.js'

describe('unwrapOutlookSafelinks', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fstory&data=foo&sdata=bar&reserved=0',
    )
    const expected = 'https://example.com/story'

    expect(unwrapOutlookSafelinks(value)).toBe(expected)
  })

  it('should extract target from a different tenant subdomain', () => {
    const value = new URL(
      'https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fstory&data=foo',
    )
    const expected = 'https://example.com/story'

    expect(unwrapOutlookSafelinks(value)).toBe(expected)
  })

  it('should extract target from a US Government host', () => {
    const value = new URL(
      'https://usg02.safelinks.protection.office365.us/?url=https%3A%2F%2Fexample.com%2Fprojects%2Fsensor-fusion&data=04%7C01%7C&sdata=foo&reserved=0',
    )
    const expected = 'https://example.com/projects/sensor-fusion'

    expect(unwrapOutlookSafelinks(value)).toBe(expected)
  })

  it('should return undefined for a host that only ends with the US Government host', () => {
    const value = new URL(
      'https://xusg02.safelinks.protection.office365.us/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOutlookSafelinks(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the US Government host', () => {
    const value = new URL(
      'https://usg02.safelinks.protection.office365.us.example.com/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOutlookSafelinks(value)).toBeUndefined()
  })

  it('should return undefined for a US Government host with one digit', () => {
    const value = new URL(
      'https://usg1.safelinks.protection.office365.us/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOutlookSafelinks(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://nam06.safelinks.protection.outlook.com/?data=foo')

    expect(unwrapOutlookSafelinks(value)).toBeUndefined()
  })

  it('should return undefined for non-Outlook hosts', () => {
    const value = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapOutlookSafelinks(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const value = new URL(
      'https://examplesafelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOutlookSafelinks(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://nam06.safelinks.protection.outlook.com/other?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOutlookSafelinks(value)).toBeUndefined()
  })

  it('should extract target from the Outlook on the web Safe Links page', () => {
    const value = new URL(
      'https://outlook.office.com/mail/safelink.html?url=https://www.example.com/2023/12/26/article/&corid=31b28bee-5f99-7cd5-fcdd-4c0b88a961cb',
    )
    const expected = 'https://www.example.com/2023/12/26/article/'

    expect(unwrapOutlookSafelinks(value)).toBe(expected)
  })

  it('should extract an encoded target from the Outlook on the web Safe Links page', () => {
    const value = new URL(
      'https://outlook.office.com/mail/safelink.html?url=https%3A%2F%2Flearn.example.com%2Fen-us%2Flicensing%23obtaining-packages&locale=en-GB&corid=31b28bee-5f99-7cd5-fcdd-4c0b88a961cb',
    )
    const expected = 'https://learn.example.com/en-us/licensing#obtaining-packages'

    expect(unwrapOutlookSafelinks(value)).toBe(expected)
  })

  it('should return undefined for another mail path on outlook.office.com', () => {
    const value = new URL('https://outlook.office.com/mail/inbox?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapOutlookSafelinks(value)).toBeUndefined()
  })

  it('should extract target from an app link path', () => {
    const value = new URL(
      'https://eur01.safelinks.protection.outlook.com/ap/t-59584e83/?url=https%3A%2F%2Fexample.com%2Fmeet%2F33196825028634%3Fp%3DzPtq&data=05',
    )
    const expected = 'https://example.com/meet/33196825028634?p=zPtq'

    expect(unwrapOutlookSafelinks(value)).toBe(expected)
  })

  it('should return undefined for another app path on the host', () => {
    const value = new URL(
      'https://eur01.safelinks.protection.outlook.com/ap/t/?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapOutlookSafelinks(value)).toBeUndefined()
  })

  it('should extract target from a multi-letter app kind', () => {
    const value = new URL(
      'https://eur01.safelinks.protection.outlook.com/ap/od-59584e83/?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapOutlookSafelinks(value)).toBe(expected)
  })
})
