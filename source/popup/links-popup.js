'use strict';

const linksPopup = () => {
  const textarea = document.getElementById('links');
  const passwordDiv = document.getElementById('password-div');
  const password = document.getElementById('password');

  const copyAndCloseBtn = document.getElementById('copy-and-close');
  const copyBtn = document.getElementById('copy');
  const closeBtn = document.getElementById('close');

  const copyLinks = (event) => {
    navigator.clipboard.writeText(textarea.value)
      .then(() => event.target.textContent = 'Copied!');
  };

  const copyLinksAndClose = (event) => {
    copyLinks(event);
    window.close();
  };

  return ({
    init: () => {
      const params = new URL(window.location).searchParams;
      const links = params.get('links');
      const pw = params.get('pw');

      if (links !== null && links !== '') {
        textarea.value = unescape(links).replace(/\0.*$/g, '');
        if (pw !== null && pw !== '') {
          password.value = unescape(pw);
          passwordDiv.style.display = 'block';
        }
        copyAndCloseBtn.addEventListener('click', copyLinksAndClose);
        copyBtn.addEventListener('click', copyLinks);
      } else {
        copyAndCloseBtn.style.display = 'none';
        copyBtn.style.display = 'none';
      }
      closeBtn.addEventListener('click', () => window.close());
    }
  });
};

linksPopup().init();
