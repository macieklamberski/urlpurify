import { describe, expect, it } from 'bun:test'
import { unwrapSapHelp } from './sapHelp.js'

describe('unwrapSapHelp', () => {
  it('should extract target from site param', () => {
    const value = new URL(
      'https://help.sap.com/docs/link-disclaimer?site=https%3A%2F%2Fwww.example.com%2Fnotes%2F2270689',
    )
    const expected = 'https://www.example.com/notes/2270689'

    expect(unwrapSapHelp(value)).toBe(expected)
  })

  it('should extract an unencoded target from the disclaimer path', () => {
    const value = new URL(
      'http://help.sap.com/disclaimer?site=https://www.example.com/BarcodeScanner',
    )
    const expected = 'https://www.example.com/BarcodeScanner'

    expect(unwrapSapHelp(value)).toBe(expected)
  })

  it('should return undefined when site param is missing', () => {
    const value = new URL('https://help.sap.com/docs/link-disclaimer?locale=en-US')

    expect(unwrapSapHelp(value)).toBeUndefined()
  })

  it('should return undefined when site param is empty', () => {
    const value = new URL('https://help.sap.com/docs/link-disclaimer?site=')

    expect(unwrapSapHelp(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://help.sap.com/docs/SAP_S4HANA_CLOUD?site=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapSapHelp(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL(
      'https://help.example.com/docs/link-disclaimer?site=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapSapHelp(value)).toBeUndefined()
  })
})
