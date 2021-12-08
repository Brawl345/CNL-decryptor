import {
  addCryptedListener,
  setInitialSettings,
  setupAction,
  switchState,
} from './service-worker-functions.js';

chrome.webRequest.onBeforeRequest.addListener(
  addCryptedListener,
  {
    urls: ['http://127.0.0.1/flash/add', 'http://127.0.0.1/flash/addcrypted2'],
  },
  ['requestBody']
);

chrome.action.onClicked.addListener(switchState);
chrome.runtime.onInstalled.addListener(setInitialSettings);
chrome.runtime.onStartup.addListener(setupAction);
chrome.storage.local.onChanged.addListener(setupAction);
