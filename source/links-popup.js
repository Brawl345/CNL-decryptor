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
  textarea: document.querySelector('#links'),
  passwordDiv: document.querySelector('#password-div'),
  passwordLabel: document.querySelector('#password-label'),
  password: document.querySelector('#password'),
  passwordNoCopyMsg: document.querySelector('#password-nocopy-msg'),
  copyAndCloseBtn: document.querySelector('#copy-and-close'),
  copyBtn: document.querySelector('#copy'),
  closeBtn: document.querySelector('#close'),
};

const copy = () => navigator.clipboard.writeText(HTML.textarea.value);

const copyLinks = (event) => {
  copy().then(() => (event.target.textContent = i18n.copied));
};

const copyLinksAndClose = () => {
  copy().then(() => window.close());
};

// Localization
document.title = i18n.title;
HTML.textarea.placeholder = i18n.noLinks;
HTML.passwordLabel.textContent = i18n.passwordLabel;
HTML.password.placeholder = i18n.noPassword;
HTML.passwordNoCopyMsg.textContent = i18n.passwordNoCopyMsg;
HTML.copyAndCloseBtn.textContent = i18n.copyAndClose;
HTML.copyBtn.textContent = i18n.copy;
HTML.closeBtn.textContent = i18n.close;

const parameters = new URL(window.location).searchParams;
const links = parameters.get('links');
const pw = parameters.get('pw');

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
