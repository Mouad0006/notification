const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/log', async (req, res) => {
  const { details } = req.body;

  if (!details) {
    return res.status(400).json({ status: 'failed', error: 'no details provided' });
  }

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: details,
      parse_mode: 'Markdown'
    });

    res.json({ status: 'success' });

  } catch (error) {
    console.error('Error sending message to Telegram:', error.message);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('SlotSelection Logger Server Running ✅');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
