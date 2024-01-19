import CryptoES from 'crypto-es';
import { AES } from 'crypto-es/lib/aes';

const keyFunctionRegex = /return ["']([\dA-Fa-f]+)["']/;
const OPTION_KEY = 'enabled';

const i18n = {
  // i18n.getMessage() does not work in Service Workers currently
  // enabled: chrome.i18n.getMessage('browserAction_enabled'),
  // disabled: chrome.i18n.getMessage('browserAction_disabled'),
  enabled: 'CNL Decryptor is ENABLED',
  disabled: 'CNL Decryptor is DISABLED',
};

const isEnabled = async () => {
  const items = await chrome.storage.local.get(OPTION_KEY);
  return (items.enabled ??= true);
};

export const addCryptedListener = async ({ url, requestBody }) => {
  // Check port, because it's not allowed in RequestListener
  if (!url.startsWith('http://127.0.0.1:9666/') || !(await isEnabled())) {
    return {};
  }

  const { crypted, jk, passwords, urls } = requestBody.formData;

  let links;

  if (urls) {
    // Plain CNL2
    links = urls[0];
  } else {
    // Standard CLN2 with Crypto
    const key = CryptoES.enc.Hex.parse(jk[0].match(keyFunctionRegex)[1]);
    const decrypted = AES.decrypt(crypted[0], key, {
      mode: CryptoES.mode.CBC,
      iv: key,
      padding: CryptoES.pad.NoPadding,
    });
    try {
      links = CryptoES.enc.Utf8.stringify(decrypted);
    } catch {
      links = CryptoES.enc.Latin1.stringify(decrypted);
    }
  }
  links = links
    .replace(/.*http/, 'http')
    .replace(/\s+/g, '\n')
    .trim();

  let popup_parameters = `?links=${escape(links)}`;
  if (passwords !== '' && passwords !== undefined && passwords !== '') {
    popup_parameters += `&pw=${escape(passwords[0])}`;
  }

  chrome.windows.create({
    url: chrome.runtime.getURL(`popup/links-popup.html${popup_parameters}`),
    width: 700,
    height: 515,
    type: 'popup',
  });

  return {};
};

export const switchState = async () => {
  const enabled = await isEnabled();
  chrome.storage.local.set({ enabled: !enabled });
};

export const setInitialSettings = ({ reason }) => {
  if (reason !== chrome.runtime.OnInstalledReason.INSTALL) {
    return;
  }
  chrome.storage.local.set({ [OPTION_KEY]: true });
  setupAction();
};

export const setupAction = async () => {
  let title;
  let icons;
  if (await isEnabled()) {
    title = i18n.enabled;
    icons = {
      16: '/icons/16.png',
      32: '/icons/32.png',
      48: '/icons/48.png',
      96: '/icons/48.png',
      128: '/icons/128.png',
    };
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ['net_rules'],
    });
  } else {
    title = i18n.disabled;
    icons = {
      16: '/icons/disabled/16.png',
      32: '/icons/disabled/32.png',
      48: '/icons/disabled/48.png',
      96: '/icons/disabled/48.png',
      128: '/icons/disabled/128.png',
    };
    chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ['net_rules'],
    });
  }

  chrome.action.setTitle({
    title: title,
  });
  chrome.action.setIcon({
    path: icons,
  });
};
