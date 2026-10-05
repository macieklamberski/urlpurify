import { describe, expect, it } from 'bun:test'
import { unwrapIgafnl } from './igafnl.js'

describe('unwrapIgafnl', () => {
  it('should extract target from redirect param', () => {
    const url = new URL(
      'https://igafnl.com/click?redirect=https%3A%2F%2Fwww.example.com%2Fspeaking&dID=1728757679450&hashId=70b7c82879aab6ef785c94ec4c86386f4&linkName=speaking',
    )

    expect(unwrapIgafnl(url)).toBe('https://www.example.com/speaking')
  })

  it('should return undefined when redirect param is missing', () => {
    const url = new URL(
      'https://igafnl.com/click?dID=1728757679450&hashId=70b7c82879aab6ef785c94ec4c86386f4',
    )

    expect(unwrapIgafnl(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('https://igafnl.com/open?redirect=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapIgafnl(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('https://example.com/click?redirect=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapIgafnl(url)).toBeUndefined()
  })
})
