# Changelog

## v2.3.1

- Reverted the closing-tab fix from v2.3.0 since it can cause the tab not to be opened at all

## v2.3.0

- Add option to open decrypted links in a popup again (only on desktop)
- After closing the tab, the previous tab will be focused again

## v2.2.0

- Switch to a tab instead of a popup with a new design
- Publish for Firefox for Android

## v2.1.1

- Fix Firefox compatibility

## v2.1.0

- Fix decryption for certain misbehaving sites
- Fix requests to jDownloader not being blocked
- Migrate to TypeScript

## v2.0.0

- Update to Manifest v3

## v1.2.1

- Fix race-condition in copy & close

## v1.2.0

- Added action button for disabling the add-on (needs new storage permission for options)
- Internal refactoring, Firefox is the primary development target, Chromium is polyfilled

## v1.1.0

- Added German translation
- Let the browser handle where to open the popup

## 1.0.2

- Fix link-trimming

## 1.0.1

- Limit host permissions to http and https URLs

## 1.0.0

- Initial release
