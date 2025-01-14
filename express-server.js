const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to list all categories
app.get('/api/categories', (req, res) => {
  const curationsDir = path.join(__dirname, 'public', 'assets', 'curations');
  fs.readdir(curationsDir, (err, files) => {
    if (err) {
      console.error('Error reading curations directory:', err);
      return res.status(500).json({ error: 'Unable to read curations directory' });
    }

    // Filter for JSON files and remove extensions for category IDs
    const categories = files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));

    res.json({ categories });
  });
});

// Rewrite all requests to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
