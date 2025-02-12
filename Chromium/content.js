let intervalId = null;

function replaceSharpS(text) {
  return text.replace(/ß/g, 'ss').replace(/ẞ/g, 'SS');
}

function scanAndReplace() {
  if (!isEnabled) return;
  const elements = document.querySelectorAll('[data-message-author-role="assistant"]');
  elements.forEach(element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.includes('ß') || node.textContent.includes('ẞ')) {
        node.textContent = replaceSharpS(node.textContent);
      }
    }
  });
}

function handleVisibilityChange() {
  if (document.hidden) {
    clearInterval(intervalId);
    intervalId = null;
  } else if (isEnabled) {
    intervalId = setInterval(scanAndReplace, 1000);
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  isEnabled = message.isEnabled;
  if (isEnabled && !document.hidden) {
    clearInterval(intervalId);
    intervalId = setInterval(scanAndReplace, 1000);
    scanAndReplace();
  } else {
    clearInterval(intervalId);
    intervalId = null;
  }
  sendResponse({ received: true });
});