const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { port } = require("./config/env");

async function startServer() {
  await connectDB();

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
