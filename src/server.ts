import 'dotenv/config';
import express, { urlencoded } from 'express';
const app = express();
import apiRoutes from './routes/api';
import cors from 'cors';
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use('/api', apiRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})