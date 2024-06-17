const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const app = express();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// GET / ルートの定義
app.get('/', async (req, res) => {
  const imageUrl = req.query.url;

  try {
    // 画像の取得
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer' // 画像をバイナリで取得
    });

    // 取得した画像をBufferに変換
    const inputBuffer = Buffer.from(response.data, 'binary');

    // 画像サイズのチェック
    if (inputBuffer.length > MAX_IMAGE_SIZE) {
      throw new Error('Requested image exceeds maximum size limit');
    }

    // 画像の圧縮と変換（WebP化）
    const outputBuffer = await sharp(inputBuffer)
      .webp()
      .toBuffer();

    // Content-Typeを設定してレスポンスとして返す
    res.set('Content-Type', 'image/webp').send(outputBuffer);
  } catch (error) {
    console.error('Error fetching or processing image:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// サーバーをポート3000で起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
