import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB setup
const db = await open({
  filename: "./eventlogs.db",
  driver: sqlite3.Database,
});
await db.exec(`
  CREATE TABLE IF NOT EXISTS event_logs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
await db.exec(`
  CREATE TABLE IF NOT EXISTS notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Healthcheck
app.get("/", (req, res) => res.send("Backend running!"));

// Example: Fetch video details
app.get("/video/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: "snippet,statistics",
          id,
          key: process.env.YT_API_KEY,
        },
      }
    );
    await db.run("INSERT INTO event_logs(action, details) VALUES(?, ?)", [
      "FETCH_VIDEO",
      id,
    ]);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
