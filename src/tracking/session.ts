import type { TrackingParam } from '../types.js'

// Classic ASP names its session cookie with eight random letters after the prefix.
const aspSessionIdRegex = /^aspsessionid[a-z]{8}$/

// A short `sid` selects content, as in `/rss?sid=46551`, and one without a digit is an affiliate
// label, as CJ's SubID. A value pasted with a second `?` keeps it at the end.
const sessionIdValueRegex = /^(?=[a-z]*\d)[0-9a-z]{26,}(?:\?|$)/i

// Server session ids, which never change what the page shows.
export const sessionParams: ReadonlyArray<TrackingParam> = Object.freeze([
  'phpsessid', // PHP
  'jsessionid', // Java servlet containers
  aspSessionIdRegex, // Classic ASP
  'cfid', // ColdFusion
  'cftoken', // ColdFusion
  { name: 'sid', value: sessionIdValueRegex }, // Generic session id
])
