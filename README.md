# urlpurify

[![codecov](https://codecov.io/gh/macieklamberski/urlpurify/branch/main/graph/badge.svg)](https://codecov.io/gh/macieklamberski/urlpurify)
[![npm version](https://img.shields.io/npm/v/urlpurify.svg)](https://www.npmjs.com/package/urlpurify)
[![license](https://img.shields.io/npm/l/urlpurify.svg)](https://github.com/macieklamberski/urlpurify/blob/main/LICENSE)

Unwrap redirect, affiliate, and tracking wrapper URLs and strip tracking parameters. Turn noisy links into clean, direct URLs.

URLs collected from feeds, emails, and social platforms rarely point straight at their destination: they pass through search-engine redirects, email security gateways, affiliate networks, and AMP caches, and carry analytics parameters that bloat the link and leak data. urlpurify ships 70+ unwrappers for known wrapper services and a list of 150+ known tracking parameters, plus a composite `cleanUrl()` that applies both. It has zero dependencies and runs in any modern JavaScript runtime, including browsers.

## Installation

```bash
npm install urlpurify
```

## Quick Start

```typescript
import { cleanUrl } from 'urlpurify'

cleanUrl('https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpost%3Futm_source%3Dnewsletter')
// => 'https://example.com/post'
```

## API

### `cleanUrl(url, options?)`

Unwraps redirect wrappers (repeatedly, since wrappers can nest), then strips tracking parameters. When the input cannot be parsed as a URL or nothing applies, the input string is returned unchanged, so the result is always safe to display.

```typescript
import { cleanUrl, defaultUnwrappers, unwrapWebArchive } from 'urlpurify'

const cleaned = cleanUrl(url, {
  // Unwrappers to apply, first match wins per pass (omit to use defaults).
  unwrappers: [...defaultUnwrappers, unwrapWebArchive],
  // Param names (matched case-insensitively) or anchored regexes tested against the
  // lowercased name (omit to use defaults).
  trackingParams: ['fbclid', /^utm_[a-z0-9_-]+$/],
  // Maximum number of unwrap passes for nested wrappers. Defaults to 3.
  maxUnwrapDepth: 3,
})
```

### `unwrapUrl(url, unwrappers?)`

Applies the unwrappers in order (one pass) and returns the first extracted target, or `undefined` when none match or the input cannot be parsed.

### `stripTrackingParams(url, trackingParams?)`

Removes matching query parameters and returns the cleaned URL. The input is returned unchanged when nothing matches or it cannot be parsed.

### `createParamExtractor(config)`

Builds an unwrapper for the common case where the target URL sits in a query parameter:

```typescript
import { cleanUrl, createParamExtractor, defaultUnwrappers } from 'urlpurify'

const unwrapExample = createParamExtractor({
  hosts: 'go.example.com', // Also accepts an array of hosts or a regex.
  params: ['target'],
})

cleanUrl(url, { unwrappers: [...defaultUnwrappers, unwrapExample] })
```

For wrappers that encode the target (base64 path segments, custom escaping), write a plain function of type `UrlUnwrapper`: it receives a `URL` and returns the target string or `undefined`.

### Defaults

`defaultTrackingParams` is the combined default list for `cleanUrl` and `stripTrackingParams`: literal names plus family regexes like `/^utm_[a-z0-9_-]+$/` that cover vendor namespaces where new variants keep appearing. Its parts are exported separately as `trackingParamsLiterals` (strings only, for consumers that need a plain string list) and `trackingParamsPatterns`. `defaultUnwrappers` is exported alongside. `defaultUnwrappers` enables a conservative subset of the catalog (search-engine redirects and social-platform shims); everything else is exported individually for explicit opt-in.

## Unwrappers

Enabled by default:

| Unwrapper | Description |
| --- | --- |
| `unwrapBing` | Bing search-result redirect (www.bing.com/ck/a?u=a1\<base64url\>) |
| `unwrapBlueskyRedirect` | Bluesky outbound link redirect (go.bsky.app/redirect?u=\<target\>) |
| `unwrapFacebookShim` | Meta link shim (l.facebook.com / l.messenger.com /l.php?u=\<target\>) |
| `unwrapGoogle` | Google redirect (google.\<TLD\>/url?url=\<target\> or ?q=\<target\>) |
| `unwrapGoogleAmpViewer` | Google AMP viewer (www.google.\<TLD\>/amp/s/\<host\>/\<path\>) |
| `unwrapGoogleNews` | Google News legacy redirect (news.google.\<TLD\>/news/url?url=\<target\>) |
| `unwrapGoogleNewsModern` | Google News modern article URLs (news.google.com/articles/\<base64\>) |
| `unwrapGoogleScholar` | Google Scholar search-result redirect (scholar.google.\<TLD\>/scholar_url?url=\<target\>) |
| `unwrapInstagramShim` | Instagram outbound link shim (l.instagram.com with ?u=\<target\>) |
| `unwrapRedditOut` | Reddit outbound click tracker (out.reddit.com/?url=\<target\>) |
| `unwrapThreadsShim` | Threads outbound link shim (l.threads.com / l.threads.net with ?u=\<target\>) |
| `unwrapVkAway` | VK away redirect (vk.com/away.php?to=\<target\>) |
| `unwrapYahooSearch` | Yahoo Search redirect (r.search.yahoo.com/.../RU=\<target\>/RK=...) |
| `unwrapYouTube` | YouTube external redirect (www.youtube.com/redirect?q=\<target\>) |

Many more are available for explicit opt-in: email security gateways (Outlook SafeLinks, Proofpoint, Mimecast), affiliate networks (Awin, Skimlinks, Commission Junction), CJK platforms, AMP caches, and others. See [src/unwraps](src/unwraps) for the full catalog, each documented in its source file.
