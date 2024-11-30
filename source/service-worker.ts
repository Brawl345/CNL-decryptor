import { addCryptedListener, setInitialSettings, setupAction, switchState } from './service-worker-functions.js';

chrome.webRequest.onBeforeRequest.addListener(
  // @ts-expect-error - Chrome does support Promises...
  addCryptedListener,
  {
    urls: ['http://127.0.0.1/flash/add', 'http://127.0.0.1/flash/addcrypted2'],
  },
  ['requestBody'],
);

chrome.action.onClicked.addListener(switchState);
chrome.runtime.onInstalled.addListener(setInitialSettings);
chrome.runtime.onStartup.addListener(setupAction);

chrome.storage.local.onChanged.addListener(({ enabled }) => {
  if (enabled && enabled.newValue !== enabled.oldValue) {
    setupAction();
  }
});
