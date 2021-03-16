'use strict';

/* global CryptoJS */

const cnlDecrypt = () => {

  // eval() is blocked everywhere so we hope that it isn't encrypted weirdly
  const keyFuncRegex = /return ['"]([0-9A-Fa-f]+)['"]/;

  const jdCheckListener = ({ url }) => {
    // Check port, because it's not allowed in RequestListener
    if (!url.startsWith('http://127.0.0.1:9666/')) {
      return {};
    }

    return {
      redirectUrl: chrome.runtime.getURL('web_accessible_resources/jdcheck.js')
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

    chrome.windows.create({
      url: chrome.runtime.getURL(`popup/links-popup.html${popup_params}`),
      width: 700,
      height: 515,
      type: 'popup'
    });

    return { cancel: true };
  };

  const init = () => {
    chrome.webRequest.onBeforeRequest.addListener(
      jdCheckListener,
      {
        urls: ['http://127.0.0.1/jdcheck.js*'],
        types: ['script']
      },
      ['blocking']
    );

    chrome.webRequest.onBeforeRequest.addListener(
      addCryptedListener,
      {
        urls: [
          'http://127.0.0.1/flash/add',
          'http://127.0.0.1/flash/addcrypted2'
        ]
      },
      ['blocking', 'requestBody']
    );
  };

  return init();
};

cnlDecrypt();
