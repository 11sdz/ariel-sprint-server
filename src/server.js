const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./prismaClient");
const memberRoutes = require("./routes/memberRoutes")
const groupsRoutes = require("./routes/groupsRoutes")
const eventsRoutes = require("./routes/eventsRoutes")
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
app.use('/api', eventsRoutes);
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