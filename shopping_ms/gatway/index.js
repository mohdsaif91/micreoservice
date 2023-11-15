const express = require("express");
const app = express();
const cors = require("cors");
const proxy = require("express-http-proxy");

app.use(express.json());
app.use(cors());

app.use("/customer", proxy("http://localhost:8001"));
app.use("/", proxy("http://localhost:8002")); // Product service
app.use("/shopping", proxy("http://localhost:8003"));

app.listen(8000, () => {
  console.log("Gateway Listening on 8000 port");
});
