import albumController from './controllers/album.controller';
import authController from './controllers/auth.controller';
import orderController from './controllers/order.controller';
import productController from './controllers/product.controller';
import itemController from './controllers/item.controller';
import vendorController from './controllers/vendor.controller';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.EXPRESS_APP_PORT;

app.use(cors({ 
  origin: process.env.REACT_APP_URL, 
  credentials: true 
}));
app.use(express.json({ limit: '2mb' }));

app.use('/albums', albumController.getRoutes());
app.use('/auth', authController.getRoutes());
app.use('/orders', orderController.getRoutes());
app.use('/products', productController.getRoutes());
app.use('/items', itemController.getRoutes());
app.use('/vendors', vendorController.getRoutes());
app.use

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
