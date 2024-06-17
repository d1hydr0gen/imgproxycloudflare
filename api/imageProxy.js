// api/imageProxy.js

const fetch = require('node-fetch');
const sharp = require('sharp');

const handler = async (request, response) => {
  try {
    const { url } = request.query;

    if (!url) {
      return response.status(400).json({ error: 'Missing url parameter' });
    }

    const imageResponse = await fetch(url);
    const imageBuffer = await imageResponse.buffer();

    // Convert image to WebP format and compress if needed
    const resizedImageBuffer = await sharp(imageBuffer)
      .webp({ quality: 80 }) // Adjust quality as needed
      .resize({ fit: 'inside', width: 1200, height: 1200 }) // Resize image as needed
      .toBuffer();

    response.setHeader('Content-Type', 'image/webp');
    response.send(resizedImageBuffer);
  } catch (error) {
    console.error('Error fetching and serving image:', error);
    response.status(500).json({ error: 'Failed to fetch image' });
  }
};

module.exports = handler;
