const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const communityMemberRoutes = require("./routes/communityMemberRoutes");
app.use("/community-members", communityMemberRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Ariel Sprint Challenge API!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
