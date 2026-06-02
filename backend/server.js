const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // fake validation
  if (email && password) {
    return res.json({
      username: "john_doe"
    });
  }

  res.status(401).json({
    message: "Invalid credentials"
  });
});

app.post("/api/submit-form", (req, res) => {
  console.log("Received Payload:");
  console.log(req.body);

  res.json({
    message: "Form submitted successfully"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});