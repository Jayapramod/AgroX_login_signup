import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors())

app.use("/api/auth", userRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
connectDB();