import {
  addCryptedListener,
  setInitialSettings,
  setupAction,
  switchState,
} from './service_worker_functions.js';

chrome.webRequest.onBeforeRequest.addListener(
  addCryptedListener,
  {
    urls: ['http://127.0.0.1/flash/add', 'http://127.0.0.1/flash/addcrypted2'],
  },
  ['requestBody']
);

chrome.action.onClicked.addListener(switchState);
chrome.runtime.onInstalled.addListener(setInitialSettings);
chrome.storage.local.onChanged.addListener(setupAction);

setupAction();
