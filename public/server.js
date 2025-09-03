const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const CLIENT_ID = "273294914895-5vhe9qupotv9ldtd03jjauhr85oed0g5";
const WHITELISTED_EMAILS = ["allowed@example.com", "admin@yourdomain.com"];

app.post('/verify-google-token', async (req, res) => {
    const { token } = req.body;

    try {
        const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const { email, aud } = googleRes.data;

        if (aud !== CLIENT_ID) {
            return res.status(403).json({ success: false, message: "Invalid client ID" });
        }

        if (WHITELISTED_EMAILS.includes(email)) {
            return res.json({ success: true, email });
        } else {
            return res.status(403).json({ success: false, message: "Email not whitelisted" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid token" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
