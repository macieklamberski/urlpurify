import { describe, expect, it } from 'bun:test'
import { unwrapCse360 } from './cse360.js'

describe('unwrapCse360', () => {
  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://click.cse360.com.br/Click/AddCampaignEmailClick/91cb06fe-2319-45d2-6cbd-08da221b4c0d/https%253a%252f%252fwww.example.com%252fin%252fmauricioconti%252f/db795461-4748-41b3-a554-cb5aed11d7b0/reporter@example.com.br/True',
    )

    expect(unwrapCse360(url)).toBe('https://www.example.com/in/mauricioconti/')
  })

  it('should extract a target encoded once', () => {
    const url = new URL(
      'https://click.cse360.com.br/Click/AddCampaignEmailClick/1a25ebdb-32dd-4eb3-6d95-08ddc399b466/https%3a%2f%2fwww.example.com.br%2fevento%2f31309/c819e0fd-a4b1-493c-9448-91075f748b0c/contato@example.com.br/False',
    )

    expect(unwrapCse360(url)).toBe('https://www.example.com.br/evento/31309')
  })

  it('should keep the query of a twice-encoded target', () => {
    const url = new URL(
      'https://click.cse360.com.br/Click/AddCampaignEmailClick/d58af596-9999-49bf-4768-08da8453b54c/https%253a%252f%252fwww.example.com.br%252fmascara%253fq%253dbombas/7ebb8248-1390-4af7-f678-08d7c5ff26d1/reader@example.com/True',
    )

    expect(unwrapCse360(url)).toBe('https://www.example.com.br/mascara?q=bombas')
  })

  it('should return undefined for a malformed target', () => {
    const url = new URL(
      'https://click.cse360.com.br/Click/AddCampaignEmailClick/91cb06fe-2319-45d2-6cbd-08da221b4c0d/https%253a%252f%252fwww.example.com%252f%25E0%25A4%25A/db795461-4748-41b3-a554-cb5aed11d7b0/reporter@example.com.br/True',
    )

    expect(unwrapCse360(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://click.cse360.com.br/Click/AddCampaignEmailClick/91cb06fe-2319-45d2-6cbd-08da221b4c0d/mailto%253areporter%2540example.com/db795461-4748-41b3-a554-cb5aed11d7b0/reporter@example.com.br/True',
    )

    expect(unwrapCse360(url)).toBeUndefined()
  })

  it('should return undefined for a link cut before the recipient', () => {
    const url = new URL(
      'https://click.cse360.com.br/Click/AddCampaignEmailClick/91cb06fe-2319-45d2-6cbd-08da221b4c0d/https%253a%252f%252fwww.example.com%252f',
    )

    expect(unwrapCse360(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://click.cse360.com.br/Open/AddCampaignEmailOpen/91cb06fe-2319-45d2-6cbd-08da221b4c0d/db795461-4748-41b3-a554-cb5aed11d7b0/reporter@example.com.br',
    )

    expect(unwrapCse360(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL(
      'https://example.com/Click/AddCampaignEmailClick/91cb06fe-2319-45d2-6cbd-08da221b4c0d/https%253a%252f%252fwww.example.org%252f/db795461-4748-41b3-a554-cb5aed11d7b0/reporter@example.com.br/True',
    )

    expect(unwrapCse360(url)).toBeUndefined()
  })

  it('should return undefined for a campaign id that is not a guid', () => {
    const url = new URL(
      'https://click.cse360.com.br/Click/AddCampaignEmailClick/campaign/https%253a%252f%252fwww.example.com%252f/db795461-4748-41b3-a554-cb5aed11d7b0/reporter@example.com.br/True',
    )

    expect(unwrapCse360(url)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const url = new URL(
      'https://click.cse360.com.br/x/Click/AddCampaignEmailClick/91cb06fe-2319-45d2-6cbd-08da221b4c0d/https%253a%252f%252fwww.example.com%252f/db795461-4748-41b3-a554-cb5aed11d7b0/reporter@example.com.br/True',
    )

    expect(unwrapCse360(url)).toBeUndefined()
  })
})
