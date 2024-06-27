import authController from './controllers/auth.controller';
import express from 'express';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/auth', authController.getRoutes());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
