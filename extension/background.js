function generateUUID() {
    return crypto.randomUUID(); // Built-in method
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.identity.getProfileUserInfo((userInfo) => {
      const email = userInfo.email || null;
      if (email) {
        chrome.storage.local.set({ user_email: email });
      } else {
        chrome.storage.local.get('device_id', (data) => {
          if (!data.device_id) {
            const uuid = generateUUID();
            chrome.storage.local.set({ device_id: uuid });
            console.log("Generated device ID:", uuid);
          }
        });
      }
    });
  });
  