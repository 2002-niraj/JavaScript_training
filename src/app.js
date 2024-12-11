import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";

dotenv.config();

const app = express();

app.use(cors("*"));
app.use(express.json());


app.use(userRoute);
app.use(adminRoute);

export default app;
