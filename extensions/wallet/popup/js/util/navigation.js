const navigate = async (page) => {
  const body = document.getElementById('body');
  body.innerHTML = '';
  body.appendChild(document.createElement(page));
  await browser.storage.local.set({ [StorageKey.CURRENT_PAGE]: page });
};
