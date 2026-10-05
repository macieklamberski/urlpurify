import { describe, expect, it } from 'bun:test'
import { unwrapContactMonkey } from './contactMonkey.js'

describe('unwrapContactMonkey', () => {
  it('should extract target from cm_destination param', () => {
    const url = new URL(
      'https://contactmonkey.com/api/v1/tracker?cm_session=d5c73751-a927-42e4-87d0-c5475d0a3459&cm_type=link&cm_link=c8b5151a-60a4-4827-bb5e-2f4e4e18e545&cm_destination=https://www.example.com/watch?v=WHr0cNF95Ok',
    )

    expect(unwrapContactMonkey(url)).toBe('https://www.example.com/watch?v=WHr0cNF95Ok')
  })

  it('should keep the params of an unencoded target', () => {
    const url = new URL(
      'https://contactmonkey.com/api/v1/tracker?cm_session=94b233fc-39ab-4e64-9bd3-90cc7b8213de&cm_type=link&cm_link=8f84c061-3db8-400f-8c8c-21b416819f6f&cm_destination=https://calendar.example.com/calendar/event?action=TEMPLATE&tmeid=MzM4MDVlcDJj&tmsrc=podcast%40example.com',
    )

    expect(unwrapContactMonkey(url)).toBe(
      'https://calendar.example.com/calendar/event?action=TEMPLATE&tmeid=MzM4MDVlcDJj&tmsrc=podcast%40example.com',
    )
  })

  it('should keep the fragment of the target', () => {
    const url = new URL(
      'https://contactmonkey.com/api/v1/tracker?cm_session=4da548ee-84db-4ead-bab2-63d4b847d666&cm_type=link&cm_link=ecaf70ee-d917-4a52-8347-d7a2f0f14644&cm_destination=https://www.example.com/page#section',
    )

    expect(unwrapContactMonkey(url)).toBe('https://www.example.com/page#section')
  })

  it('should return undefined when cm_destination param is missing', () => {
    const url = new URL(
      'https://contactmonkey.com/api/v1/tracker?cm_session=d5c73751-a927-42e4-87d0-c5475d0a3459&cm_type=open',
    )

    expect(unwrapContactMonkey(url)).toBeUndefined()
  })

  it('should return undefined for a param that only ends with cm_destination', () => {
    const url = new URL(
      'https://contactmonkey.com/api/v1/tracker?cm_session=d5c73751&xcm_destination=https://www.example.com/',
    )

    expect(unwrapContactMonkey(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://contactmonkey.com/api/v1/tracker/fallback?cm_destination=https://www.example.com/',
    )

    expect(unwrapContactMonkey(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL(
      'https://example.com/api/v1/tracker?cm_destination=https://www.example.org/',
    )

    expect(unwrapContactMonkey(url)).toBeUndefined()
  })
})
