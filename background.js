function getBlockedPageUrl() {
  return chrome.runtime.getURL("blocked.html");
}

function setupBlocking(blockedUrls) {
  if (blockedUrls && blockedUrls.length) {
    const patterns = blockedUrls.map((url) => url + "*");
    chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
      urls: patterns,
      types: ["main_frame"],
    });
  }
}

function blockRequest(details) {
  const url = new URL(details.url);
  chrome.storage.sync.get(["blockedUrls"], (result) => {
    if (result.blockedUrls) {
      const blockedUrls = result.blockedUrls.map(
        (url) => new URL(url).hostname
      );
      if (blockedUrls.includes(url.hostname)) {
        chrome.tabs.update(details.tabId, { url: getBlockedPageUrl() });
      }
    }
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.blockedUrls) {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
    setupBlocking(changes.blockedUrls.newValue);
  }
});

chrome.storage.sync.get(["blockedUrls"], (result) => {
  setupBlocking(result.blockedUrls);
});
