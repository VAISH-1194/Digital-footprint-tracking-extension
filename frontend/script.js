// script.js

chrome.storage.local.get(['user_email', 'device_id'], (data) => {
    const identifier = data.user_email || data.device_id || 'unknown_user'; // Ensure fallback to a unique ID
    document.getElementById('user-id').textContent = `User ID: ${identifier}`;
  
    // View Activity button functionality
    document.getElementById('view-activity').addEventListener('click', () => {
        viewActivity(identifier);
    });

    // Download Report button functionality
    document.getElementById('download-report').addEventListener('click', () => {
        downloadReport(identifier);
    });

    // Track user activities (for example: page load, clicks, etc.)
    trackUserActivities(identifier);
});

function viewActivity(identifier) {
    // Fetch activities from the backend
    fetch(`http://localhost:3000/activities/${identifier}`)
        .then((response) => response.json())
        .then((activities) => {
            const activityList = document.getElementById('activities');
            activityList.innerHTML = ''; // Clear previous activities

            // Display the activities
            activities.forEach((activity) => {
                const li = document.createElement('li');
                li.textContent = `Type: ${activity.type}, URL: ${activity.url}, Timestamp: ${activity.timestamp}`;
                activityList.appendChild(li);
            });

            // Show the activity list
            document.getElementById('activity-list').style.display = 'block';
        })
        .catch((error) => {
            console.error('Error fetching activities:', error);
        });
}

function downloadReport(identifier) {
    // Fetch activities for the identifier
    fetch(`http://localhost:3000/activities/${identifier}`)
        .then((response) => response.json())
        .then((activities) => {
            const reportData = [
                ['Timestamp', 'Activity Type', 'URL', 'Element', 'Text', 'Suspicion Score', 'IP Address', 'Browser Info', 'Platform', 'Time Zone', 'Screen Resolution', 'Activity ID']
            ];

            // Prepare the data to download as CSV
            activities.forEach((activity) => {
                reportData.push([
                    activity.timestamp,
                    activity.type,
                    activity.url,
                    activity.element || 'N/A',
                    activity.text || 'N/A',
                    activity.suspicion_score || 'N/A',
                    activity.ip_address || 'N/A',
                    activity.browser_info || 'N/A',
                    activity.platform || 'N/A',
                    activity.timezone || 'N/A',
                    activity.screen_resolution || 'N/A',
                    activity.email || activity.device_id
                ]);
            });

            // Convert the array to CSV format
            const csv = reportData.map(row => row.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${identifier}_activity_report.csv`;
            link.click();
        })
        .catch((error) => {
            console.error('Error downloading report:', error);
        });
}

function trackUserActivities(identifier) {
    // Function to send tracked activity data to the server
    function sendActivity(activity) {
        fetch('http://localhost:3000/activity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activity),
        }).catch(err => console.error('Send failed:', err));
    }

    // Track page load
    sendActivity({
        email: identifier,
        type: 'page_load',
        url: window.location.href,
        timestamp: new Date().toISOString(),
    });

    // Track clicks
    document.addEventListener('click', (e) => {
        sendActivity({
            email: identifier,
            type: 'click',
            element: e.target.tagName,
            text: e.target.innerText.slice(0, 100),
            url: window.location.href,
            timestamp: new Date().toISOString(),
        });
    });

    // Track searches
    document.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'search') {
            sendActivity({
                email: identifier,
                type: 'search',
                query: e.target.value,
                url: window.location.href,
                timestamp: new Date().toISOString(),
            });
        }
    });
}
