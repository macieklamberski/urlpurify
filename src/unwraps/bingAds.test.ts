import { describe, expect, it } from 'bun:test'
import { unwrapBingAds } from './bingAds.js'

describe('unwrapBingAds', () => {
  it('should extract the target of an aclk link', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZib29raW5nJTJmMTIzNDU=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBe('https://www.example.com/booking/12345')
  })

  it('should extract the target of an aclick link', () => {
    const url = new URL(
      'https://www.bing.com/aclick?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZib29raW5nJTJmMTIzNDU=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBe('https://www.example.com/booking/12345')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZsZWFybi1tb3JlJTNmdXRtX3NvdXJjZSUzZGJpbmclMjZ1dG1fbWVkaXVtJTNkY3BjJTI2bXNjbGtpZCUzZGFiYzEyMw==&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBe(
      'https://www.example.com/learn-more?utm_source=bing&utm_medium=cpc&msclkid=abc123',
    )
  })

  it('should keep an encoded url inside the query of the target', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZwYWdlJTNma2V5d29yZCUzZGh0dHBzJTI1M0ElMjUyRiUyNTJGd3d3LmV4YW1wbGUub3JnJTI1MkY=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBe(
      'https://www.example.com/page?keyword=https%3A%2F%2Fwww.example.org%2F',
    )
  })

  it('should extract a target that is another ad click', () => {
    const url = new URL(
      'https://www.bing.com/aclick?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cCUzYSUyZiUyZmNsaWNrc2VydmUuZXhhbXBsZS5jb20lMmZsaW5rJTJmY2xpY2slM2ZsaWQlM2Q0MzcwMDA0MDMzMzQxNDUyNSUyNmRzX3Nfa3dnaWQlM2Q1ODcwMDAwNDc0NTk0MDU4Ng==&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBe(
      'http://clickserve.example.com/link/click?lid=43700040333414525&ds_s_kwgid=58700004745940586',
    )
  })

  it('should decode a UTF-8 target', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZjYWYlYzMlYTklM2ZxJTNkYSUyMGI=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBe('https://www.example.com/café?q=a b')
  })

  it('should extract the target of a value without padding', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZib29raW5nJTJmMTIzNDU&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBe('https://www.example.com/booking/12345')
  })

  it('should extract the target when the u param comes first', () => {
    const url = new URL(
      'https://www.bing.com/aclk?u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZib29raW5nJTJmMTIzNDU=&ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc',
    )

    expect(unwrapBingAds(url)).toBe('https://www.example.com/booking/12345')
  })

  it('should extract the target of a plain http wrapper', () => {
    const url = new URL(
      'http://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZib29raW5nJTJmMTIzNDU=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBe('https://www.example.com/booking/12345')
  })

  it('should return undefined when the u param is missing', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })

  it('should return undefined when the u param is empty', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })

  it('should return undefined for a value that is not base64', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=!!!&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })

  it('should return undefined for a value whose letter case was lost', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=ahr0chmlm2elmmylmmz3d3cuzxhhbxbszs5jb20lmmzib29raw5njtjmmtizndu=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=ZnRwJTNhJTJmJTJmZXhhbXBsZS5jb20lMmZmaWxlLnppcA==&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })

  it('should return undefined for a target with a broken percent escape', () => {
    const url = new URL(
      'https://www.bing.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZleGFtcGxlLmNvbSUyZiVFMCVBNCVB&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })

  it('should return undefined for the search result redirect path', () => {
    const url = new URL(
      'https://www.bing.com/ck/a?!&&p=abc&u=a1aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYm9va2luZy8xMjM0NQ&ntb=1',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL(
      'https://www.bing.com/search?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZib29raW5nJTJmMTIzNDU=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with an ad path', () => {
    const url = new URL(
      'https://www.bing.com/aclick/x?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZib29raW5nJTJmMTIzNDU=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL(
      'https://www.example.com/aclk?ld=e8v53HweaYYJO4-AI3B9EQTjVUCUw_PMEVmStLE-Ak7-miCUGacAv4rlEWkyDU3pP48rH2hc&u=aHR0cHMlM2ElMmYlMmZ3d3cuZXhhbXBsZS5jb20lMmZib29raW5nJTJmMTIzNDU=&rlid=d9a7f0c1b2e44d5a8c3b6e1f0a2d4c7b&ntb=1',
    )

    expect(unwrapBingAds(url)).toBeUndefined()
  })
})
