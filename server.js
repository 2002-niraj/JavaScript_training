import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
dotenv.config();
const app = express();
const { PORT } = process.env;

app.use(express.json());
app.use(userRoute);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
