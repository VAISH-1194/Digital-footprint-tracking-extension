document.addEventListener('DOMContentLoaded', function () {
    // Assuming a backend API that provides all user activity
    fetch('http://localhost:3000/users') // Your backend will need to provide a list of users
      .then((response) => response.json())
      .then((users) => {
        users.forEach((user) => {
          createUserCard(user);
        });
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  });
  
  // Creates a user card with buttons
  function createUserCard(user) {
    const userList = document.getElementById('user-list');
    const userCard = document.createElement('div');
    userCard.className = 'user';
  
    userCard.innerHTML = `
      <h3>${user.email || user.device_id}</h3>
      <div class="buttons">
        <button onclick="viewActivity('${user.email || user.device_id}')">View Activity</button>
        <button onclick="downloadReport('${user.email || user.device_id}')">Download Report</button>
      </div>
    `;
  
    userList.appendChild(userCard);
  }
  
  // Simulate the "View Activity" button (for now just logging to the console)
  function viewActivity(identifier) {
    console.log(`Viewing activity for ${identifier}`);
    // Ideally, you'd display activities from the last 24 hours here.
    alert('View User Activity - Coming soon!');
  }
  
  // Simulate the "Download Report" button
  function downloadReport(identifier) {
    console.log(`Downloading report for ${identifier}`);
    // For now, simulate downloading a CSV or Excel file
    const reportData = [
      ['Timestamp', 'Activity Type', 'URL'],
      ['2025-05-08 12:00', 'Page Load', 'https://example.com'],
      ['2025-05-08 12:05', 'Click', 'https://example.com'],
    ];
  
    const csv = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${identifier}_activity_report.csv`;
    link.click();
  }
  