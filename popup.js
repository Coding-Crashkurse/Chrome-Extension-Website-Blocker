document.addEventListener("DOMContentLoaded", () => {
  const blockButton = document.getElementById("blockButton");
  const urlInput = document.getElementById("urlInput");
  const blockedUrlsList = document.getElementById("blockedUrlsList");

  // Funktion, um die Liste der blockierten URLs anzuzeigen
  function displayBlockedUrls(blockedUrls) {
    blockedUrlsList.innerHTML = "";
    blockedUrls.forEach((url) => {
      const listItem = document.createElement("li");
      listItem.textContent = url;
      blockedUrlsList.appendChild(listItem);
    });
  }

  // Die Liste der blockierten URLs beim Laden des Popups anzeigen
  chrome.storage.sync.get(["blockedUrls"], (result) => {
    if (result.blockedUrls) {
      displayBlockedUrls(result.blockedUrls);
    }
  });

  blockButton.addEventListener("click", () => {
    const url = urlInput.value.trim();

    if (url) {
      chrome.storage.sync.get(["blockedUrls"], (result) => {
        let blockedUrls = result.blockedUrls || [];
        blockedUrls.push(url);
        chrome.storage.sync.set({ blockedUrls }, () => {
          displayBlockedUrls(blockedUrls);
          urlInput.value = "";
        });
      });
    }
  });
});
