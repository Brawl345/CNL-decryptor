'use strict';

const linksPopup = () => {

  const i18n = {
    title: chrome.i18n.getMessage('extensionName'),
    noLinks: chrome.i18n.getMessage('popup_noLinks'),
    passwordLabel: chrome.i18n.getMessage('popup_passwordLabel'),
    noPassword: chrome.i18n.getMessage('popup_noPassword'),
    passwordNoCopyMsg: chrome.i18n.getMessage('popup_passwordNoCopyMsg'),
    copyAndClose: chrome.i18n.getMessage('popup_copyAndClose'),
    copy: chrome.i18n.getMessage('popup_copy'),
    close: chrome.i18n.getMessage('popup_close'),
    copied: chrome.i18n.getMessage('popup_copied'),
  };

  const HTML = {
    textarea: document.getElementById('links'),
    passwordDiv: document.getElementById('password-div'),
    passwordLabel: document.getElementById('password-label'),
    password: document.getElementById('password'),
    passwordNoCopyMsg: document.getElementById('password-nocopy-msg'),
    copyAndCloseBtn: document.getElementById('copy-and-close'),
    copyBtn: document.getElementById('copy'),
    closeBtn: document.getElementById('close'),
  };

  const localize = () => {
    document.title = i18n.title;
    HTML.textarea.placeholder = i18n.noLinks;
    HTML.passwordLabel.textContent = i18n.passwordLabel;
    HTML.password.placeholder = i18n.noPassword;
    HTML.passwordNoCopyMsg.textContent = i18n.passwordNoCopyMsg;
    HTML.copyAndCloseBtn.textContent = i18n.copyAndClose;
    HTML.copyBtn.textContent = i18n.copy;
    HTML.closeBtn.textContent = i18n.close;
  };

  const copyLinks = (event) => {
    navigator.clipboard.writeText(HTML.textarea.value)
      .then(() => event.target.textContent = i18n.copied);
  };

  const copyLinksAndClose = (event) => {
    copyLinks(event);
    window.close();
  };

  const init = () => {
    localize();
    const params = new URL(window.location).searchParams;
    const links = params.get('links');
    const pw = params.get('pw');

    if (links !== null && links !== '') {
      HTML.textarea.value = unescape(links).replace(/\0.*$/g, '');
      if (pw !== null && pw !== '') {
        HTML.password.value = unescape(pw);
        HTML.passwordDiv.style.display = 'block';
      }
      HTML.copyAndCloseBtn.addEventListener('click', copyLinksAndClose);
      HTML.copyBtn.addEventListener('click', copyLinks);
    } else {
      HTML.copyAndCloseBtn.style.display = 'none';
      HTML.copyBtn.style.display = 'none';
    }
    HTML.closeBtn.addEventListener('click', () => window.close());
  };

  return init();
};

linksPopup();
