const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Key yang diizinkan
const VALID_KEYS = [
  "VCX-109",
  "PREMIUM-2026"
];

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/api/login", (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({
      success: false,
      message: "Key kosong."
    });
  }

  if (VALID_KEYS.includes(key)) {
    return res.json({
      success: true,
      redirect: "/dom.html"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid Access Key"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});