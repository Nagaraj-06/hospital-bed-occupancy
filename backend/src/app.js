const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");
const { frontendUrl } = require("./config/env");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.get("/", (req, res) => res.send("API is running"));
app.use("/api", routes);

// Error middleware
app.use(errorMiddleware);

module.exports = app;
