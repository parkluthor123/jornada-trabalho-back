import express, { urlencoded } from 'express';
const app = express();
import apiRoutes from './routes/api';
import cors from 'cors';

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use('/api', apiRoutes);

app.listen(3333, () => {
    console.log('Server is running on port 3333');
})