const i18n = {
  title: chrome.i18n.getMessage('extensionName'),
  noLinks: chrome.i18n.getMessage('popup_noLinks'),
  passwordLabel: chrome.i18n.getMessage('popup_passwordLabel'),
  noPassword: chrome.i18n.getMessage('popup_noPassword'),
  passwordNoCopyMsg: chrome.i18n.getMessage('popup_passwordNoCopyMsg'),
  copy: chrome.i18n.getMessage('popup_copy'),
  copied: chrome.i18n.getMessage('popup_copied'),
  share: chrome.i18n.getMessage('popup_share'),
};

const HTML = {
  textarea: document.querySelector('#links') as HTMLTextAreaElement,
  passwordDiv: document.querySelector('#password-div') as HTMLDivElement,
  passwordLabel: document.querySelector('#password-label') as HTMLSpanElement,
  password: document.querySelector('#password') as HTMLInputElement,
  passwordNoCopyMsg: document.querySelector('#password-nocopy-msg') as HTMLSpanElement,
  copyBtn: document.querySelector('#copy') as HTMLButtonElement,
  shareBtn: document.querySelector('#share') as HTMLButtonElement,
};

const copyLinks = async (event: Event) => {
  HTML.textarea.select();
  await navigator.clipboard.writeText(HTML.textarea.value);
  (event.target as HTMLSpanElement).textContent = i18n.copied;
  setTimeout(() => {
    (event.target as HTMLSpanElement).textContent = i18n.copy;
  }, 3000);
};

// const share = async () => {
//   await navigator.share({
//     text: HTML.textarea.value,
//   });
// };

// Localization
(document.querySelector('html') as HTMLElement).setAttribute('lang', chrome.i18n.getUILanguage());
document.title = i18n.title;
HTML.textarea.placeholder = i18n.noLinks;
HTML.passwordLabel.textContent = i18n.passwordLabel;
HTML.password.placeholder = i18n.noPassword;
HTML.passwordNoCopyMsg.textContent = i18n.passwordNoCopyMsg;
HTML.copyBtn.textContent = i18n.copy;
HTML.shareBtn.textContent = i18n.share;

const parameters = new URL(window.location.href).searchParams;
const links = parameters.get('links');
const pw = parameters.get('pw');

if (links !== null && links !== '') {
  HTML.textarea.value = decodeURIComponent(links).replaceAll(/\0.*$/g, '');
  if (pw !== null && pw !== '') {
    HTML.password.value = decodeURIComponent(pw);
    HTML.passwordDiv.classList.remove('hidden');
  }
  HTML.copyBtn.classList.remove('hidden');
  HTML.copyBtn.addEventListener('click', copyLinks);

  HTML.textarea.select();

  // Firefox does not support navigator.share with text yet
  // if ('share' in navigator && navigator.canShare({ text: 'example' })) {
  //   HTML.shareBtn.classList.remove('hidden');
  //   HTML.shareBtn.addEventListener('click', share);
  // }
} else {
  HTML.copyBtn.style.display = 'none';
}
