const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const categories = ["Normal", "Premium", "Prime time"];
const locations = ["Agadir", "Tangier", "Tetouan", "Rabat", "Casablanca", "Nador"];
const visaTypes = ["CAS1", "Schengen/CAS2", "National"];
const visaSubTypes = ["Schengen/CAS1/CAS2/Student", "FAMR", "National", "Work"];

app.post('/log', async (req, res) => {
  const { details } = req.body;

  if (!details) {
    return res.status(400).json({ status: 'failed', error: 'no details provided' });
  }

  const message = `
📌 إشعار SlotSelection جديد:

🌐 الرابط: ${details.url}
📍 المدينة: ${locations[details.formLocation]}
📑 نوع الفيزا: ${visaTypes[details.visaType]}
🗃 التصنيف: ${categories[details.category]}
📂 النوع الفرعي للفيزا: ${visaSubTypes[details.visaSubType]}
👥 عدد الأشخاص: ${details.numberofapplicants}
`;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    res.json({ status: 'success' });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

