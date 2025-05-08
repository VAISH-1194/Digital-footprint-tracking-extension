// backend/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const activityLog = [];

// Function to get platform info
function getDeviceDetails(req, activity) {
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const platform = os.platform();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timestamp = new Date().toISOString();

  return {
    ...activity,
    browser: userAgent,
    platform,
    timezone,
    timestamp
  };
}

// Record activity
app.post('/activity', (req, res) => {
  const activity = getDeviceDetails(req, req.body);

  activityLog.push(activity);

  console.log(`[Activity] Received from ${activity.email} | ${activity.timestamp} | ${activity.type} | ${activity.browser} | ${activity.platform} | ${activity.timezone}`);

  res.sendStatus(200);
});

// Get all activities for a user
app.get('/activities/:userId', (req, res) => {
  const userId = req.params.userId;
  const filtered = activityLog.filter(act => act.email === userId);
  res.json(filtered);
});

// Download report
app.get('/download/:userId', (req, res) => {
  const userId = req.params.userId;
  const filtered = activityLog.filter(act => act.email === userId);

  const csv = [
    'Timestamp,Event Type,Email,Element,Text,URL,Browser,Platform,Timezone,Screen Resolution,Window Size'
  ];

  filtered.forEach(act => {
    csv.push(`"${act.timestamp}","${act.type}","${act.email}","${act.element || ''}","${act.text || ''}","${act.url}","${act.browser}","${act.platform}","${act.timezone}","${act.screen || ''}","${act.window || ''}"`);
  });

  const filePath = path.join(__dirname, 'report.csv');
  fs.writeFileSync(filePath, csv.join('\n'));

  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
