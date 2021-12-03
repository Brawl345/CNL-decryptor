# CNL Decryptor

Intercepts Click'N'Load requests to jDownloader and shows the plain URLs and password instead.

The add-on can be temporarily disabled via an action button in the toolbar.

## Warning: Chrome Bug!

Manifest v3 has a nasty bug that prevents the webRequest API from working when the service worker goes to sleep. Track
the progess here: https://bugs.chromium.org/p/chromium/issues/detail?id=1024211

## Install

- Available on [addons.mozilla.org](https://addons.mozilla.org/firefox/addon/cnl-decryptor/)
- Available on
  the [Chrome Web Store](https://chrome.google.com/webstore/detail/cnl-decryptor/hfmolcaikbnbminafcmeiejglbeelilh)

## Build

1. Clone
2. Install dependencies with `npm ci`
3. Run `npm run dev` for bundling the JS
4. Run `npm run start:chrome` for starting the browser with the extension pre-loaded and ready for debugging with
   hot-reloading
5. Build with `npm run build`

## Resources

- [Click'n'Load 2 documentation](https://jdownloader.org/knowledge/wiki/glossary/cnl2) with test links

![Screenshot](screenshot.png?raw=true "Screenshot")
