let isEnabled = true;

const replaceSharpSInTextNode = (node) => {
  if (node.textContent.includes('ß') || node.textContent.includes('ẞ')) {
    node.textContent = node.textContent.replace(/ß/g, 'ss').replace(/ẞ/g, 'SS');
  }
};

const replaceSharpSInElement = (element) => {
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      replaceSharpSInTextNode(node);
    } else {
      replaceSharpSInElement(node);
    }
  });
};

const scanDOM = () => {
  if (!isEnabled) return;
  document.querySelectorAll('[data-message-author-role="assistant"]').forEach(replaceSharpSInElement);
};

let intervalId = setInterval(scanDOM, 2000);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(intervalId);
  } else {
    intervalId = setInterval(scanDOM, 2000);
    scanDOM();
  }
});

browser.runtime.onMessage.addListener((message) => {
  isEnabled = message.isEnabled;
  if (isEnabled) {
    scanDOM();
    intervalId = setInterval(scanDOM, 2000);
  } else {
    clearInterval(intervalId);
  }
});

scanDOM();