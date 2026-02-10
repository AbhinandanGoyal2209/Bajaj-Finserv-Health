const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const EMAIL = "abhinandan0177.be23@chitkara.edu.in";

/* ---------- HELPERS ---------- */

const fibonacci = (n) => {
  let a = 0, b = 1, res = [];
  for (let i = 0; i < n; i++) {
    res.push(a);
    [a, b] = [b, a + b];
  }
  return res;
};

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const hcf = (arr) => arr.reduce(gcd);
const lcm = (arr) => arr.reduce((a, b) => (a * b) / gcd(a, b));

/* ---------- ROUTES ---------- */

app.get("/health", (req, res) => {
  res.json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const key = Object.keys(body)[0];
    let data;

    switch (key) {
      case "fibonacci":
        data = fibonacci(body.fibonacci);
        break;

      case "prime":
        data = body.prime.filter(isPrime);
        break;

      case "lcm":
        data = lcm(body.lcm);
        break;

      case "hcf":
        data = hcf(body.hcf);
        break;

      case "AI":
        const aiRes = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: body.AI }] }]
          }
        );
        const text = aiRes.data.candidates[0].content.parts[0].text;
        data = text.match(/[A-Za-z]+/g).pop();
        break;

      default:
        throw new Error("Invalid key");
    }

    res.json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch (err) {
    res.status(400).json({
      is_success: false,
      error: err.message
    });
  }
});

module.exports = app;
