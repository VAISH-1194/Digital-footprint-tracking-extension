document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['user_email', 'device_id'], (data) => {
    const identifier = data.user_email || data.device_id || 'unknown_user';
    document.getElementById('user-id').textContent = 'User ID: ' + identifier;

    document.getElementById('view-activity').addEventListener('click', () => {
      fetch(`http://localhost:3000/activity/${identifier}`)
        .then(res => res.json())
        .then(data => {
          const list = document.getElementById('activities');
          list.innerHTML = '';
          data.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = `[${activity.timestamp}] ${activity.type} - ${activity.url}`;
            list.appendChild(li);
          });
        })
        .catch(err => console.error('Error fetching activity:', err));
    });

    document.getElementById('download-report').addEventListener('click', () => {
      window.open(`http://localhost:3000/download/${identifier}`, '_blank');
    });
  });
});