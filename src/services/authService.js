const axios = require("axios");
const { createMemberFromLinkedIn } = require("../services/memberService");

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const CALLBACK_URL = process.env.LINKEDIN_REDIRECT_URI;

const handleLinkedInAuth = async (req, res) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  try {
    const tokenResp = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: CALLBACK_URL,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }
    });

    const accessToken = tokenResp.data.access_token;

    const userInfoResp = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const userInfo = userInfoResp.data;
    
    const newMember = await createMemberFromLinkedIn(userInfo);
    
    res.status(201).json({ success: true, member: newMember });

  } catch (err) {
    console.error("LinkedIn OAuth Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.toString() });
  }
};

module.exports = { handleLinkedInAuth };
