let isEnabled = true;

const updateIcon = () => {
  const iconPath = isEnabled ? "icons/Enabled/Ico_Active-128x128.png" : "icons/Disabled/Ico_Disabled-128x128.png";
  browser.browserAction.setIcon({ path: iconPath });
};

browser.browserAction.onClicked.addListener(() => {
  isEnabled = !isEnabled;
  console.log(isEnabled);
  updateIcon();
  // Handle ChatGPT tabs
  browser.tabs.query({ url: "*://*.chatgpt.com/*" }, (tabs) => {
    tabs.forEach((tab) => {
      browser.tabs.sendMessage(tab.id, { isEnabled });
    });
  });
  // Handle Copilot tabs
  browser.tabs.query({ url: "*://copilot.microsoft.com/*" }, (tabs) => {
    tabs.forEach((tab) => {
      browser.tabs.sendMessage(tab.id, { isEnabled });
    });
  });
    // Handle Gemeni tabs
    browser.tabs.query({ url: "*://gemini.google.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        browser.tabs.sendMessage(tab.id, { isEnabled });
      });
  });
});

updateIcon();