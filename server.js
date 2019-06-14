const express = require("express");
const connectDB = require("./config/db");

const app = express();

// CONNECT DATABASE
connectDB();

// EXPRESS BODY PARSER MIDDLEWARE
app.use(express.json({ extended: true }));

// SETTING UP ROUTES
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profiles", require("./routes/api/profiles"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("APi runnig and shit");
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
