// const express = require("express");
// const axios = require("axios");
// require("dotenv").config();

// const app = express();
// app.use(express.json());

// const PORT = 3000;
// const EMAIL = "abhinandan0177.be23@chitkara.edu.in";

// // Fibonacci series
// const fibonacci = (n) => {
//   if (n <= 0) return [];
//   let a = 0, b = 1;
//   const res = [0];
//   while (res.length < n) {
//     res.push(b);
//     [a, b] = [b, a + b];
//   }
//   return res;
// };

// // Prime check
// const isPrime = (num) => {
//   if (num < 2) return false;
//   for (let i = 2; i <= Math.sqrt(num); i++) {
//     if (num % i === 0) return false;
//   }
//   return true;
// };

// // GCD
// const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

// // HCF
// const hcf = (arr) => arr.reduce((a, b) => gcd(a, b));

// // LCM
// const lcm = (arr) => arr.reduce((a, b) => (a * b) / gcd(a, b));



// // Health Check API
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     is_success: true,
//     official_email:"abhinandan0177.be23@chitkara.edu.in"
//   });
// });

// // Main API
// app.post("/bfhl", async (req, res) => {
//   try {
//     const body = req.body;
//     const keys = Object.keys(body);

//     if (keys.length !== 1) {
//       return res.status(400).json({
//         is_success: false,
//         error: "Request must contain exactly one key"
//       });
//     }

//     const key = keys[0];
//     let data;

//     switch (key) {
//       case "fibonacci":
//         if (!Number.isInteger(body.fibonacci)) {
//           throw new Error("Fibonacci input must be an integer");
//         }
//         data = fibonacci(body.fibonacci);
//         break;

//       case "prime":
//         if (!Array.isArray(body.prime)) {
//           throw new Error("Prime input must be an array");
//         }
//         data = body.prime.filter(isPrime);
//         break;

//       case "lcm":
//         if (!Array.isArray(body.lcm)) {
//           throw new Error("LCM input must be an array");
//         }
//         data = lcm(body.lcm);
//         break;

//       case "hcf":
//         if (!Array.isArray(body.hcf)) {
//           throw new Error("HCF input must be an array");
//         }
//         data = hcf(body.hcf);
//         break;

//       case "AI":
//         if (typeof body.AI !== "string") {
//           throw new Error("AI input must be a string");
//         }

//         const aiResponse = await axios.post(
//           `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
//           {
//             contents: [
//               {
//                 role: "user",
//                 parts: [{ text: body.AI }]
//               }
//             ]
//           }
//         );

//         data = aiResponse.data.candidates[0].content.parts[0].text
//           .split(" ")[0]
//           .replace(/[^a-zA-Z]/g, "");

//         break;

//       default:
//         throw new Error("Invalid request key");
//     }

//     return res.status(200).json({
//       is_success: true,
//       official_email: EMAIL,
//       data
//     });

//   } catch (err) {
//     return res.status(400).json({
//       is_success: false,
//       error: err.message
//     });
//   }
// });


// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });

// module.exports = app;

// if (require.main === module) {
//   app.listen(process.env.PORT || 3000, () => {
//     console.log("Server running");
//   });
// }

const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const EMAIL = "abhinandan0177.be23@chitkara.edu.in";

/* ========== HELPERS ========== */

const fibonacci = (n) => {
  if (n <= 0) return [];
  let a = 0, b = 1;
  const res = [0];
  while (res.length < n) {
    res.push(b);
    [a, b] = [b, a + b];
  }
  return res;
};

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const hcf = (arr) => arr.reduce((a, b) => gcd(a, b));
const lcm = (arr) => arr.reduce((a, b) => (a * b) / gcd(a, b));

/* ========== ROUTES ========== */

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
        const aiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: body.AI }] }]
          }
        );

        const text = aiResponse.data.candidates[0].content.parts[0].text;
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
