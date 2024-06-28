import authController from './controllers/auth.controller';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.EXPRESS_APP_PORT;

app.use(cors({ 
  origin: process.env.REACT_APP_URL, 
  credentials: true 
}));
app.use(express.json({ limit: '2mb' }));

app.use('/auth', authController.getRoutes());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
