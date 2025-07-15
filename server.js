// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cors())
app.use(express.json());
const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, CALLBACK_URL } = process.env;
console.log({ LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, CALLBACK_URL });


app.post('/auth/linkedin/token', async (req, res) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: 'Missing code' });
  try {
    const params = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: CALLBACK_URL,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }
    console.log(params);

    const tokenResp = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: params,
    });
    const accessToken = tokenResp.data.access_token;
    res.json({ token: accessToken });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(4000, () => console.log('Listening on 4000'));
