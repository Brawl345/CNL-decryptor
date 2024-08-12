# CNL Decryptor

Intercepts Click'N'Load requests to jDownloader and shows the plain URLs and password instead.

The add-on can be temporarily disabled via an action button in the toolbar.

## Install

- Available on
  the [Chrome Web Store](https://chrome.google.com/webstore/detail/cnl-decryptor/hfmolcaikbnbminafcmeiejglbeelilh) (Requires Chrome 107+)
- Available on [addons.mozilla.org](https://addons.mozilla.org/firefox/addon/cnl-decryptor/), also for Android

## Build

1. Clone
2. Install dependencies with `npm ci`
3. Run `npm run dev` for bundling the JS
4. Run `npm run start:chrome` or `npm run start:firefox` for starting the browser with the extension pre-loaded and ready for debugging with
   hot-reloading
5. Build with `npm run build`

## Resources

- [Click'n'Load 2 documentation](https://jdownloader.org/knowledge/wiki/glossary/cnl2) with test links

![Screenshot](screenshot.png?raw=true "Screenshot")
