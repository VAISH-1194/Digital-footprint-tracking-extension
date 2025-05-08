const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// TEMP store for user activity
const userLogs = {};

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Digital Footprint Tracker API is running!');
  });
  
// POST /activity → Store activity
app.post('/activity', (req, res) => {
  const activity = req.body;
  const email = activity.email || 'unknown@example.com';

  if (!userLogs[email]) userLogs[email] = [];
  userLogs[email].push(activity);

  console.log(`[Activity] Received from ${email}`);
  res.status(200).send({ message: 'Activity logged' });
});

// GET /users → List email IDs
// Add a new endpoint to get all users (just an example)
app.get('/users', (req, res) => {
    const users = [
      { email: 'user1@example.com' },
      { device_id: 'bd21e14f-02ae-451e-87b4-6ffeef12a51d' },
      // Add more users dynamically from your DB or storage
    ];
    
    res.json(users);
  });
  
// GET /activity/:email → Last 24h activity
app.get('/activity/:email', (req, res) => {
  const email = req.params.email;
  const now = Date.now();
  const activities = (userLogs[email] || []).filter(a => {
    return now - new Date(a.timestamp).getTime() < 24 * 60 * 60 * 1000;
  });
  res.send(activities);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
