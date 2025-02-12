let isEnabled = true;

const updateIcon = () => {
  const iconPath = isEnabled ? "icons/Enabled/Ico_Active-128x128.png" : "icons/Disabled/Ico_Disabled-128x128.png";
  browser.browserAction.setIcon({ path: iconPath });
};

browser.browserAction.onClicked.addListener(() => {
  isEnabled = !isEnabled;
  updateIcon();
  browser.tabs.query({ url: "*://*.chatgpt.com/*" }, (tabs) => {
    tabs.forEach((tab) => {
      browser.tabs.sendMessage(tab.id, { isEnabled });
    });
  });
});

updateIcon();