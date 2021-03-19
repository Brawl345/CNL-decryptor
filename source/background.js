'use strict';

/* global CryptoJS */

const cnlDecrypt = () => {

  const OPTIONS = {
    enabled: true
  };

  const i18n = {
    enabled: browser.i18n.getMessage('browserAction_enabled'),
    disabled: browser.i18n.getMessage('browserAction_disabled'),
  };

  // eval() is blocked everywhere so we hope that it isn't encrypted weirdly
  const keyFuncRegex = /return ['"]([0-9A-Fa-f]+)['"]/;

  const jdCheckListener = ({ url }) => {
    // Check port, because it's not allowed in RequestListener
    if (!url.startsWith('http://127.0.0.1:9666/')) {
      return {};
    }

    return {
      redirectUrl: browser.runtime.getURL('web_accessible_resources/jdcheck.js')
    };
  };

  const addCryptedListener = ({ url, requestBody }) => {
    // Check port, because it's not allowed in RequestListener
    if (!url.startsWith('http://127.0.0.1:9666/')) {
      return {};
    }

    const { crypted, jk, passwords, urls } = requestBody.formData;

    let links;

    if (urls) // Plain CNL2
    {
      links = urls[0];
    } else { // Standard CNL2 with Crypto
      const key = CryptoJS.enc.Hex.parse(jk[0].match(keyFuncRegex)[1]);
      const decrypted = CryptoJS.AES.decrypt(crypted[0], key, {
        mode: CryptoJS.mode.CBC,
        iv: key,
        padding: CryptoJS.pad.NoPadding
      });
      links = CryptoJS.enc.Utf8.stringify(decrypted);
    }

    links = links.replace(/\s+/g, '\n');

    let popup_params = `?links=${escape(links)}`;
    if (passwords !== '' && passwords !== undefined && passwords !== '') {
      popup_params += `&pw=${escape(passwords[0])}`;
    }

    browser.windows.create({
      url: browser.runtime.getURL(`popup/links-popup.html${popup_params}`),
      width: 700,
      height: 515,
      type: 'popup'
    });

    return { cancel: true };
  };

  const loadOptions = async () => {
    const userOptions = await browser.storage.local.get(OPTIONS);

    for (const key in userOptions) {
      OPTIONS[key] = userOptions[key];
    }
  };

  const switchState = async () => {
    OPTIONS.enabled = !OPTIONS.enabled;
    await browser.storage.local.set(OPTIONS);
    await setup();
  };

  const setup = async () => {
    let title = i18n.enabled;
    let icons = {
      '16': 'icons/16.png',
      '32': 'icons/32.png',
      '48': 'icons/48.png',
      '96': 'icons/48.png',
      '128': 'icons/128.png'
    };

    if (OPTIONS.enabled === true) {
      browser.webRequest.onBeforeRequest.addListener(
        jdCheckListener,
        {
          urls: ['http://127.0.0.1/jdcheck.js*'],
          types: ['script']
        },
        ['blocking']
      );

      browser.webRequest.onBeforeRequest.addListener(
        addCryptedListener,
        {
          urls: [
            'http://127.0.0.1/flash/add',
            'http://127.0.0.1/flash/addcrypted2'
          ]
        },
        ['blocking', 'requestBody']
      );
    } else {
      title = i18n.disabled;
      icons = {
        '16': 'icons/disabled/16.png',
        '32': 'icons/disabled/32.png',
        '48': 'icons/disabled/48.png',
        '96': 'icons/disabled/48.png',
        '128': 'icons/disabled/128.png'
      };
      browser.webRequest.onBeforeRequest.removeListener(jdCheckListener);
      browser.webRequest.onBeforeRequest.removeListener(addCryptedListener);
    }

    await browser.browserAction.setTitle({
      title: title
    });
    await browser.browserAction.setIcon({
      path: icons
    });
  };

  const init = async () => {
    await loadOptions();
    await setup();
    browser.browserAction.onClicked.addListener(switchState);
  };

  return init();
};

cnlDecrypt();
