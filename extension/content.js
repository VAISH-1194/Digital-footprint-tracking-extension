(function () {
  chrome.storage.local.get(['user_email', 'device_id'], (data) => {
    const identifier = data.user_email || data.device_id || 'unknown_user';

    sendActivity({
      email: identifier,
      type: 'page_load',
      url: window.location.href,
      timestamp: new Date().toISOString()
    });

    document.addEventListener('click', (e) => {
      sendActivity({
        email: identifier,
        type: 'click',
        element: e.target.tagName,
        text: e.target.innerText.slice(0, 100),
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    });

    document.addEventListener('input', (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'search') {
        sendActivity({
          email: identifier,
          type: 'search',
          query: e.target.value,
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
      }
    });
  });

  function sendActivity(activity) {
    fetch('http://localhost:3000/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(activity)
    }).catch(err => console.error('Send failed:', err));
  }
})();