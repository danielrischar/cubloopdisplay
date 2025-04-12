const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for all routes to support SPA behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
});