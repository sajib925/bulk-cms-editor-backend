import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import apiRouter from "./api";


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Hello World! From Cms Bulk Editor api");
});

app.listen(port, () => {
  return console.log(`Cms Bulk Editor api is listening at http://localhost:${port}`);
});
