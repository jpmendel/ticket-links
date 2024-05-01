const main = async () => {
  const { currentPage } = await browser.storage.local.get(
    StorageKey.CURRENT_PAGE,
  );
  await navigate(currentPage || Page.ACCOUNTS_LIST);
};

window.onload = () => main();
