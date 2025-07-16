const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./prismaClient");
const memberRoutes = require("./routes/memberRoutes")
const groupsRoutes = require("./routes/groupsRoutes")
const authRoutes = require("./routes/authRoutes")

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Ariel Sprint Challenge API!");
});

app.use('/api', memberRoutes);
app.use('/api', groupsRoutes);
app.use('/api', authRoutes)

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

// const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
// const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
// const CALLBACK_URL = process.env.LINKEDIN_REDIRECT_URI;

// LinkedIn OAuth Token Route
// app.post('/auth/linkedin/token', async (req, res) => {
//   const code = req.body.code;
//   if (!code) return res.status(400).json({ error: 'Missing code' });

//   try {
//     const params = {
//       grant_type: 'authorization_code',
//       code,
//       redirect_uri: CALLBACK_URL,
//       client_id: LINKEDIN_CLIENT_ID,
//       client_secret: LINKEDIN_CLIENT_SECRET,
//     };

//     console.log("LinkedIn OAuth Params:", params);

//     // Request access token from LinkedIn
//     const tokenResp = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
//       params: params,
//       // headers: {
//       //   'Content-Type': 'application/x-www-form-urlencoded'
//       // }
//     });

//     const accessToken = tokenResp.data.access_token;
//     const expiresIn = tokenResp.data.expires_in;
//     const expireTime = new Date(Date.now() + expiresIn * 1000);
//     const scope = tokenResp.data.scope;

//     // Request user information using the access token
//     const userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });

//     // Extract user information
//     const userInfo = userInfoResponse.data;
//     console.log("infoooo",userInfo);

//   } catch (err) {
//     console.error("LinkedIn OAuth Error:", err.response?.data || err.message);
//     res.status(500).json({ error: err.toString() });
//   }
// });
