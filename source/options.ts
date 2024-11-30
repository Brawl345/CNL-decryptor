import { defaults, getOptions } from './storage';
import { MessageVariant, type Options } from './types';

const i18n = {
  title: chrome.i18n.getMessage('options_title'),
  extensionName: chrome.i18n.getMessage('extensionName'),
  noOptionsAvailable: chrome.i18n.getMessage('options_noOptionsAvailable'),
  openModeLabel: chrome.i18n.getMessage('options_openMode_label'),
  openModeValueTab: chrome.i18n.getMessage('options_openMode_value_tab'),
  openModeValuePopup: chrome.i18n.getMessage('options_openMode_value_popup'),
  save: chrome.i18n.getMessage('options_save'),
  saveSuccess: chrome.i18n.getMessage('options_save_success'),
  saveFail: chrome.i18n.getMessage('options_save_fail'),
};

const HTML = {
  title: document.querySelector('#title') as HTMLHeadingElement,
  form: document.querySelector('#options-form') as HTMLFormElement,
  noOptionsMessage: document.querySelector('#no-options-available') as HTMLParagraphElement,
  openModeLabel: document.querySelector('label[for="openMode"]') as HTMLLabelElement,
  openModeValueTab: document.querySelector('select[name="openMode"] > option[value="tab"]') as HTMLSelectElement,
  openModeValuePopup: document.querySelector('select[name="openMode"] option[value="popup"]') as HTMLSelectElement,
  save: document.querySelector('#save') as HTMLButtonElement,
  message: document.querySelector('#message') as HTMLSpanElement,
};

const clearMessage = () => {
  HTML.message.style.display = 'none';
  HTML.message.className = '';
};

const setMessage = (variant: MessageVariant, text: string) => {
  HTML.message.textContent = text;
  HTML.message.className = variant;
  HTML.message.style.display = 'block';
  setTimeout(clearMessage, 2500);
};

const restoreOptions = async () => {
  const { openMode } = await getOptions();
  const htmlElement = document.querySelector('select[name="openMode"]') as HTMLSelectElement;
  htmlElement.value = openMode;
};

const saveOptions = async (event: SubmitEvent) => {
  event.preventDefault();
  const userOptions: Options = { ...defaults };
  const openMode = document.querySelector('select[name="openMode"]') as HTMLSelectElement;
  userOptions.openMode = openMode.value as Options['openMode'];

  try {
    await chrome.storage.local.set(userOptions);
    setMessage(MessageVariant.Success, i18n.saveSuccess);
  } catch (error) {
    console.error(error);
    setMessage(MessageVariant.Error, i18n.saveFail);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // Localize
  document.title = i18n.title;
  HTML.title.textContent = i18n.extensionName;

  HTML.openModeLabel.textContent = i18n.openModeLabel;
  HTML.openModeValueTab.textContent = i18n.openModeValueTab;
  HTML.openModeValuePopup.textContent = i18n.openModeValuePopup;

  HTML.save.textContent = i18n.save;

  HTML.noOptionsMessage.textContent = i18n.noOptionsAvailable;

  await restoreOptions();
  document.addEventListener('submit', saveOptions);

  const { os } = await chrome.runtime.getPlatformInfo();
  if (os === 'android') {
    // Available options make no sense on Android so we just hide them there
    HTML.noOptionsMessage.classList.remove('hidden');
  } else {
    HTML.form.classList.remove('hidden');
  }
});
