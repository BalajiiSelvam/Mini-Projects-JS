// Import packages
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// LeetCode API route
app.get("/leetcode/:username", async (req, res) => {
  try {
    const username = req.params.username;
    console.log(`Fetching LeetCode data for: ${username}`);

    const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);

    if (!response.ok) {
      throw new Error("Failed to fetch data from LeetCode API");
    }

    const data = await response.json();

    // Send response to frontend
    res.json(data);
  } catch (error) {
    console.error("Error fetching LeetCode data:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
