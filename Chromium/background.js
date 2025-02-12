let isEnabled = true;

// Load saved state when extension starts
function checkstorage(){
  chrome.storage.local.get(['isEnabled'], (result) => {
    if (result.isEnabled !== undefined) {
      isEnabled = result.isEnabled;
      updateIcon();
    }
  });
}
const updateIcon = () => {
  const iconPath = isEnabled ? "icons/Enabled/Ico_Active-128x128.png" : "icons/Disabled/Ico_Disabled-128x128.png";
  chrome.action.setIcon({ path: iconPath });
};

const notifyTab = (tabId) => {
  chrome.tabs.sendMessage(tabId, { isEnabled }, (response) => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tabId, { isEnabled });
      });
    }
  });
};

chrome.action.onClicked.addListener(() => {
  isEnabled = !isEnabled;
  chrome.storage.local.set({ isEnabled });
  updateIcon();
  chrome.tabs.query({ url: "*://*.chatgpt.com/*" }, (tabs) => {
    tabs.forEach(tab => notifyTab(tab.id));
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('chatgpt.com')) {
    notifyTab(tabId);
  }
});
checkstorage();