# HEIC & Live Photo Converter (extension)

A minimal Manifest V3 browser extension that opens a fully local HEIC converter and adds native file/folder picking.

**[Open the converter →](https://heicv.pages.dev/)** · [Firefox Add-ons](https://addons.mozilla.org/firefox/)

## Why this extension is tiny

All decoding and conversion runs on the website, in WebAssembly, inside your browser. This repository contains **only the extension shell**:

- `src/popup.js` — two actions: open the converter, or pick files
- `src/bridge.js` — a ~70-line message bridge so the page can trigger a native file picker
- `manifest.json` — MV3, with `storage` + `tabs` only

No image data ever passes through the extension. `bridge.js` makes zero network requests and never reads file contents — it only dispatches `File` objects back to the page, which then decodes them locally.

## Design constraints

| Constraint | Consequence |
| --- | --- |
| WASM + Worker need a relaxed CSP | Processing lives on the site, not in the extension |
| Tuning the converter shouldn't require a store review | Site deploys instantly |
| Fewer permissions = faster review, more trust | No `activeTab`, no `<all_urls>`, no `downloads` |
| The site must work without the extension | Extension is purely additive |

## Permissions

- `tabs` — open the converter in a new tab
- `storage` — remember language preference
- `host_permissions` for `*.pages.dev` / `*.vercel.app` — inject `bridge.js` on the landing page only

## Load locally

Firefox: `about:debugging#/runtime/this-firefox` → *Load Temporary Add-on* → `manifest.json`
Chrome/Edge: `chrome://extensions` → Developer mode → *Load unpacked*

Requires Firefox **140+**.

## Related

- Converter: <https://heicv.pages.dev/> — HEIC → JPG/PNG in batch, Live Photo → GIF/MP4
- Local decoding via libheif WASM; batch memory optimized (100 photos ≈ 4.5 MB)
- The website source is not in this repository (production builds are obfuscated)

## License

MIT
