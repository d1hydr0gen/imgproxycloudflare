// index.js

const express = require('express');
const sharp = require('sharp');
const fetch = require('node-fetch');
const app = express();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

app.get('/api/imageProxy', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    // Fetch image data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image (${response.status}): ${response.statusText}`);
    }

    const imageBuffer = await response.buffer();
    const imageSize = imageBuffer.length;

    // Check if image size exceeds maximum allowed size
    if (imageSize > MAX_IMAGE_SIZE) {
      return res.status(413).json({ error: 'Image size exceeds maximum allowed size (5MB)' });
    }

    // Convert image to WebP format
    const webpData = await sharp(imageBuffer)
      .webp()
      .toBuffer();

    // Set response headers for WebP image
    res.set('Content-Type', 'image/webp');
    res.send(webpData);
  } catch (error) {
    console.error('Error fetching and serving image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
