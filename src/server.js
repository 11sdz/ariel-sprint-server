const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const prisma = require("./prismaClient");
const memberRoutes = require("./routes/memberRoutes")
const groupsRoutes = require("./routes/groupsRoutes")

dotenv.config();
const app = express();

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const CALLBACK_URL = process.env.LINKEDIN_REDIRECT_URI;


app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Ariel Sprint Challenge API!");
});

// LinkedIn OAuth Token Route
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
    };

    console.log("LinkedIn OAuth Params:", params);

    const tokenResp = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResp.data.access_token;
    res.json({ token: accessToken });
  } catch (err) {
    console.error("LinkedIn OAuth Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Ariel Sprint Challenge API!");
});

app.use('/api', memberRoutes);
app.use('/api', groupsRoutes);



async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
  }
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

main();