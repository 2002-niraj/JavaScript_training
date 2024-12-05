import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import cors from 'cors'
dotenv.config();
const app = express();
const { PORT } = process.env;

app.use(cors())
app.use(express.json());
app.use(userRoute,adminRoute);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
