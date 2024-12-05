import CryptoES from 'crypto-es';
import { AES } from 'crypto-es/lib/aes';
import { getOptions } from './storage';

const keyFunctionRegex = /return ["']([\dA-Fa-f]+)["']/;
const OPTION_KEY = 'enabled';
const RULESET_ID = 'net_rules';

const i18n = {
  enabled: chrome.i18n.getMessage('browserAction_enabled'),
  disabled: chrome.i18n.getMessage('browserAction_disabled'),
};

export const addCryptedListener = async ({
  url,
  requestBody,
}: chrome.webRequest.WebRequestBodyDetails): Promise<chrome.webRequest.BlockingResponse> => {
  const { enabled, openMode } = await getOptions();

  // Check port, because it's not allowed in RequestListener
  if (!url.startsWith('http://127.0.0.1:9666/') || !enabled) {
    return {};
  }

  if (requestBody?.formData === undefined) {
    return {};
  }

  const { crypted, jk, passwords, urls } = requestBody.formData;

  let links: string;

  if (urls) {
    // Plain CNL2
    links = urls[0];
  } else {
    // Standard CLN2 with Crypto

    const jkMatch = jk[0].match(keyFunctionRegex);
    if (jkMatch === null) {
      return {};
    }

    const key = CryptoES.enc.Hex.parse(jkMatch[1]);
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
    .replaceAll(/\s+/g, '\n')
    .trim();

  let popup_parameters = `?links=${encodeURIComponent(links)}`;
  if (passwords !== undefined && passwords[0] !== '') {
    popup_parameters += `&pw=${encodeURIComponent(passwords[0])}`;
  }

  if (openMode === 'popup') {
    await chrome.windows.create({
      url: chrome.runtime.getURL(`popup/links-popup.html${popup_parameters}`),
      width: 800,
      height: 600,
      type: 'popup',
    });
  } else {
    await chrome.tabs.create({
      url: chrome.runtime.getURL(`popup/links-popup.html${popup_parameters}`),
    });
  }

  return {};
};

export const switchState = async () => {
  const { enabled } = await getOptions();
  await chrome.storage.local.set({ enabled: !enabled });
};

export const setInitialSettings = ({ reason }: chrome.runtime.InstalledDetails) => {
  if (reason !== chrome.runtime.OnInstalledReason.INSTALL) {
    return;
  }
  chrome.storage.local.set({ [OPTION_KEY]: true });
  setupAction();
};

export const setupAction = async () => {
  let title: string;
  let icons: Record<number, string>;
  const { enabled } = await getOptions();
  if (enabled) {
    title = i18n.enabled;
    icons = {
      16: '/icons/16.png',
      32: '/icons/32.png',
      48: '/icons/48.png',
      96: '/icons/48.png',
      128: '/icons/128.png',
    };
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [RULESET_ID],
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
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: [RULESET_ID],
    });
  }

  await chrome.action.setTitle({
    title: title,
  });
  await chrome.action.setIcon({
    path: icons,
  });
};
