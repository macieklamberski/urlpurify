# urlcleaner

[![codecov](https://codecov.io/gh/macieklamberski/urlcleaner/branch/main/graph/badge.svg)](https://codecov.io/gh/macieklamberski/urlcleaner)
[![npm version](https://img.shields.io/npm/v/urlcleaner.svg)](https://www.npmjs.com/package/urlcleaner)
[![license](https://img.shields.io/npm/l/urlcleaner.svg)](https://github.com/macieklamberski/urlcleaner/blob/main/LICENSE)

Unwrap redirect, affiliate, and tracking wrapper URLs and strip tracking parameters. Turn noisy links into clean, direct URLs.

URLs collected from feeds, emails, and social platforms rarely point straight at their destination: they pass through search-engine redirects, email security gateways, affiliate networks, and AMP caches, and carry analytics parameters that bloat the link and leak data. urlcleaner ships 74 unwrappers for known wrapper services and a list of 152 known tracking parameters, plus a composite `cleanUrl()` that applies both. It has zero dependencies and runs in any modern JavaScript runtime, including browsers.

## Installation

```bash
npm install urlcleaner
```

## Quick Start

```typescript
import { cleanUrl } from 'urlcleaner'

cleanUrl('https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpost%3Futm_source%3Dnewsletter')
// => 'https://example.com/post'
```

## API

### `cleanUrl(url, options?)`

Unwraps redirect wrappers (repeatedly, since wrappers can nest), then strips tracking parameters. When the input cannot be parsed as a URL or nothing applies, the input string is returned unchanged, so the result is always safe to display.

| Option | Default | Description |
| --- | --- | --- |
| `unwrappers` | `defaultUnwrappers` | Unwrappers to apply, first match wins per pass |
| `trackingParams` | `defaultTrackingParams` | Query parameter names to remove, matched case-insensitively |
| `maxUnwrapDepth` | `3` | Maximum number of unwrap passes for nested wrappers |

### `unwrapUrl(url, unwrappers)`

Applies the unwrappers in order to a `URL` instance and returns the first extracted target as a string, or `undefined` when none match.

### `stripTrackingParams(url, trackingParams)`

Deletes matching query parameters from a `URL` instance in place and returns whether anything was removed.

### `createParamExtractor(config)`

Builds an unwrapper for the common case where the target URL sits in a query parameter:

```typescript
import { cleanUrl, createParamExtractor, defaultUnwrappers } from 'urlcleaner'

const unwrapExample = createParamExtractor({
  hosts: 'go.example.com', // Also accepts an array of hosts or a regex.
  params: ['target'],
})

cleanUrl(url, { unwrappers: [...defaultUnwrappers, unwrapExample] })
```

For wrappers that encode the target (base64 path segments, custom escaping), write a plain function of type `UrlUnwrapper`: it receives a `URL` and returns the target string or `undefined`.

### Defaults

`defaultTrackingParams` and `defaultUnwrappers` are exported from the package root and from the lighter `urlcleaner/defaults` subpath. `defaultUnwrappers` enables a conservative subset of the catalog (search-engine redirects and social-platform shims); everything else is exported individually for explicit opt-in.

## Unwrappers

| Unwrapper | Description | Default |
| --- | --- | --- |
| `unwrapAceml` | ActiveCampaign ACEML link tracker (\<host\>.acemln[a-d].com/Prod/link-tracker ?redirectUrl=\<base64\>). The redirectUrl param is base64-encoded. |  |
| `unwrapAdjust` | Adjust deep-link tracker (app.adjust.com/\<token\>?redirect=\<target\>). The `redirect` param sometimes contains a custom-scheme URI (e.g. `myapp://...`) that's only meaningful inside the target app; only forward http(s) values. |  |
| `unwrapAmazonAffiliate` | Amazon affiliate click tracker (\<region\>.amazon-adsystem.com/x/c/\<id\>/\<URL\>). The target URL is appended verbatim to the path after the click identifier. |  |
| `unwrapAmpCache` | AMP cache (cdn.ampproject.org/c/[s/]\<hostname\>/\<path\>). The optional publisher subdomain is a hint; the path always carries the canonical hostname. |  |
| `unwrapAwin` | Awin affiliate redirect (www.awin1.com/cread.php?ued=\<target\> or ?p=\<target\>). |  |
| `unwrapBing` | Bing search-result redirect (www.bing.com/ck/a?u=a1\<base64url\>). The `u` parameter is a base64url-encoded URL prefixed by a two-byte version marker (`a1`, `a2`, ...). | Yes |
| `unwrapCjNetwork` | Commission Junction / CJ affiliate network redirects across rotating brand hostnames (?url=\<target\>). |  |
| `unwrapDigidip` | digidip affiliate redirect (\<publisher\>.digidip.net/visit?url=\<target\>). |  |
| `unwrapDisqus` | Disqus outbound link redirect (disq.us/?url=\<target\>). |  |
| `unwrapDouban` | Douban external link redirect (www.douban.com/link2/?url=\<target\>). |  |
| `unwrapDuckduckgo` | DuckDuckGo search-result redirect (duckduckgo.com/l/?uddg=\<target\>). |  |
| `unwrapEbayRover` | eBay Rover affiliate redirect (rover.ebay.\<TLD\>/...?mpre=\<target\>). |  |
| `unwrapEffiliation` | Effiliation French affiliate network (?url=\<target\>). |  |
| `unwrapEmbedly` | Embedly oEmbed widget proxy (cdn.embedly.com or embed.ly with ?src=\<target\>). |  |
| `unwrapFacebookShim` | Facebook link shim (l.facebook.com/l.php?u=\<target\>). | Yes |
| `unwrapFeedsportal` |  |  |
| `unwrapFirebaseDynamicLinks` | Firebase Dynamic Links (\<project\>.page.link/?link=\<canonical\>&ofl=\<fallback\>). `link` is the canonical destination; `ofl` is the web fallback used when no app handler is available. They're often identical, but when they differ `link` is the more correct choice. |  |
| `unwrapFlipboard` | Flipboard outbound redirect (flipboard.com/redirect?url=\<target\>). |  |
| `unwrapGateSc` | gate.sc URL-shortener-style redirect (?url=\<target\>). |  |
| `unwrapGeoriot` | GeoRiot / Geni.us geo-targeted affiliate redirect (target.georiot.com/?GR_URL=\<target\>). |  |
| `unwrapGitee` | Gitee external link redirect (gitee.com/link?target=\<target\>). |  |
| `unwrapGoogle` | Google redirect (google.\<TLD\>/url?url=\<target\> or google.\<TLD\>/url?q=\<target\>). | Yes |
| `unwrapGoogleAmpViewer` | Google AMP viewer (www.google.\<TLD\>/amp/s/\<host\>/\<path\> for https, or /amp/\<host\>/\<path\> for http). Distinct from the cdn.ampproject.org cache. | Yes |
| `unwrapGoogleNews` | Google News legacy redirect (news.google.\<TLD\>/news/url?url=\<target\>). Modern news.google.\<TLD\>/articles/\<base64\> URLs aren't unwrappable client-side. | Yes |
| `unwrapGoogleNewsModern` | Google News modern article URLs (news.google.com/articles/\<base64\> or /rss/articles/\<base64\>). The article id is a base64url-encoded protobuf containing the destination URL between known framing bytes. Some ids (typically post-2023) require a server-side signature exchange and can only be resolved with a network call, those return undefined silently. | Yes |
| `unwrapGoogleScholar` | Google Scholar search-result redirect (scholar.google.\<TLD\>/scholar_url?url=\<target\>). | Yes |
| `unwrapGoogleTranslate` | Google Translate (translate.google.\<TLD\>/translate?u=\<target\>). Not included in defaultUrlUnwrappers: translate.google.com renders the target translated, so unwrapping discards the translation the user wanted. Opt in by passing a custom urlUnwrappers array. |  |
| `unwrapHashnode` | Hashnode outbound redirect (hashnode.com/util/redirect?url=\<target\>). |  |
| `unwrapIcptrack` | ICPTrack email click tracker (click.icptrack.com/icp/relay.php?...&destination=\<target\>). |  |
| `unwrapIdealoPartner` | Idealo German shopping affiliate (?trg=\<target\>). |  |
| `unwrapInstagramShim` | Instagram outbound link shim (l.instagram.com or lm.instagram.com with ?u=\<target\>). | Yes |
| `unwrapJianshuGo` | Jianshu external link redirect (links.jianshu.com/go?to=\<target\>). |  |
| `unwrapJuejin` | Juejin external link redirect (link.juejin.cn/?target=\<target\>). |  |
| `unwrapLeverAnalytics` | Lever Analytics email click tracker (t.lever-analytics.com/...?dest=\<target\>). |  |
| `unwrapLinksynergy` | LinkSynergy affiliate redirect (click.linksynergy.com/deeplink?murl=\<target\>). |  |
| `unwrapMailchimp` | Mailchimp click tracker (\<list\>.mailchimp.com/mctx/clicks?url=\<target\>). |  |
| `unwrapMailpanion` | Mailpanion email click tracker (mailpanion.com/?destination=\<target\>). |  |
| `unwrapMailpgn` | Campaign Monitor / mailpgn email tracker (t.mailpgn.com/l/?fl=\<target\>). |  |
| `unwrapMailtrack` | Mailtrack email click tracker (mailtrack.io/?url=\<target\>). |  |
| `unwrapMedium` | Medium outbound link redirect (medium.com/r/?url=\<target\>). |  |
| `unwrapMimecast` | Mimecast email link protection (\<region\>.mimecast.com/...?url=\<target\> or ?domain=\<host\>). The `domain` form lacks a scheme, so we synthesise https. |  |
| `unwrapMozillaOutgoing` | Mozilla outgoing-link redirector used on Mozilla mailing lists, blogs, and support forums. Path: /v1/\<sha256\>/\<URL-encoded-target\> |  |
| `unwrapNarrativ` | Narrativ influencer-affiliate redirect (api.narrativ.com or narrativ.com with ?url=\<target\>). Not included in defaultUrlUnwrappers: Narrativ uses real-time auction bidding to route clicks to the highest-bidding retailer, so the embedded `url` may not be where the click actually lands. Opt in by passing a custom urlUnwrappers array. |  |
| `unwrapNicoMs` | nico.ms short link rewrite. `/sm`, `/nm`, `/so` prefixes route to the nicovideo watch page; `/im` routes to the seiga illustration page. |  |
| `unwrapOutlookSafelinks` | Outlook SafeLinks (\<tenant\>.safelinks.protection.outlook.com/?url=\<target\>). |  |
| `unwrapPartnerAds` | partner-ads.com Danish affiliate network (?htmlurl=\<target\>). |  |
| `unwrapPocket` | Pocket redirect (getpocket.com/redirect?url=\<target\>). |  |
| `unwrapPostmark` | Postmark click-tracking redirect (click.pstmrk.it/\<version\>\<kind\>/\<encoded\>/...). The version prefix is `2s`, `2t`, `3s`, or `3t`; the next segment carries the URL-encoded target. |  |
| `unwrapProofpointV1` | Proofpoint URLDefense v1 (urldefense.proofpoint.com/v1/url?u=\<encoded\>). The encoded URL substitutes `_` for `/` and `-` for `%`, then is URL-decoded. |  |
| `unwrapProofpointV2` | Proofpoint URLDefense v2 (urldefense.proofpoint.com/v2/url?u=\<encoded\>). The encoded URL substitutes `_` for `/` and `-` for `%`, then is URL-decoded. |  |
| `unwrapProofpointV3` | Proofpoint URLDefense v3 (urldefense.com/v3/__\<mangled\>__;\<b64\>!!\<sig\>$). `*` characters in the mangled URL are restored from the base64 segment; `**X` runs restore a fixed byte count (A=2 through `_`=65). |  |
| `unwrapPxf` | Impact Radius / pxf.io affiliate redirect (\<merchant\>.pxf.io/?u=\<target\>). |  |
| `unwrapRecruitics` | Recruitics job-listings redirect (jsv3.recruitics.com/redirect?rx_url=\<target\>). |  |
| `unwrapRedditOut` | Reddit outbound click tracker (out.reddit.com/?url=\<target\>). | Yes |
| `unwrapRedirectingat` | Skimlinks family `redirectingat.com` affiliate redirect (?url=\<target\>). |  |
| `unwrapSegmentfault` | Segmentfault external link redirect (link.segmentfault.com/?enc=\<base64\>). The enc param is a base64-encoded target URL. |  |
| `unwrapShareasale` | ShareASale affiliate redirect (shareasale.com/r.cfm?urllink=\<target\>). |  |
| `unwrapSjv` | Sovrn / sjv.io affiliate redirect (\<merchant\>.sjv.io/?u=\<target\>). |  |
| `unwrapSkimlinks` | Skimlinks affiliate redirect (go.skimresources.com/?url=\<target\>). |  |
| `unwrapSlack` | Slack link redirect (slack-redir.net/link?url=\<target\>). |  |
| `unwrapSmartredirect` | smartredirect.de affiliate redirect (?url=\<target\>). |  |
| `unwrapSspai` | Sspai external link redirect (sspai.com/link?target=\<target\>). |  |
| `unwrapSteamLinkfilter` | Steam outbound link filter (steamcommunity.com/linkfilter/?url=\<target\>). |  |
| `unwrapTelegramIv` | Telegram Instant View (t.me/iv?url=\<target\>&rhash=\<hash\>). Not included in defaultUrlUnwrappers: `t.me/iv` opens the URL inside Telegram's Instant View reader (a reformatted, lightweight rendering), not a redirect to the source. Opt in by passing a custom urlUnwrappers array. |  |
| `unwrapTradedoubler` | Tradedoubler affiliate redirect (clk.tradedoubler.com/click?url=\<target\>). |  |
| `unwrapTumblr` | Tumblr outbound redirect (t.umblr.com/redirect?z=\<target\>). |  |
| `unwrapValuecommerce` | ValueCommerce affiliate redirect (ck.jp.ap.valuecommerce.com/servlet/referral?vc_url=\<target\>). |  |
| `unwrapViglink` | VigLink affiliate redirect (redirect.viglink.com/?u=\<target\>). |  |
| `unwrapVkAway` | VK away redirect (vk.com/away.php?to=\<target\>). | Yes |
| `unwrapWebArchive` | Web Archive snapshot wrapper (web.archive.org/web/\<timestamp\>/\<URL\>). Not included in defaultUrlUnwrappers: an archive URL is a historical snapshot at a specific point in time, not a redirect; unwrapping returns the live page, which may have changed or 404'd. Opt in by passing a custom urlUnwrappers array. |  |
| `unwrapYahooSearch` | Yahoo Search redirect (r.search.yahoo.com/.../RU=\<URL-encoded-target\>/RK=...). | Yes |
| `unwrapYandexTurbo` | Yandex Turbo cached page (\<source-host-with-dashes\>.turbopages.org/\<host\>/s/\<path\>). The subdomain encodes the original host, replacing `.` with `-`; the path after `/s/` is the original path. Not included in defaultUrlUnwrappers: Turbo serves a stripped-down, optimized rendering of the source page rather than the canonical content. Opt in by passing a custom urlUnwrappers array. |  |
| `unwrapYouTube` | YouTube external redirect (www.youtube.com/redirect?q=\<target\>). | Yes |
| `unwrapZhihu` | Zhihu external redirect (link.zhihu.com/?target=\<target\>). |  |

## License

Licensed under the [MIT License](LICENSE).
