import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is listening to port ${port}`);
});
