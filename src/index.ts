// src/index.ts

// dependency modules
import express from 'express';
import cors from 'cors';
// self-defined modules
import albumController from './controllers/album.controller';
import authController from './controllers/auth.controller';
import bundleController from './controllers/bundle.controller';
import cartController from './controllers/cart.controller';
import categoryController from './controllers/category.controller';
import cityController from './controllers/city.controller';
import eventController from './controllers/event.controller';
import faqController from './controllers/faq.controller';
import itemController from './controllers/item.controller';
import orderController from './controllers/order.controller';
import productController from './controllers/product.controller';
import reviewController from './controllers/review.controller';
import settingController from './controllers/setting.controller';
import vendorController from './controllers/vendor.controller';
import visitController from './controllers/visit.controller';
import wishlistController from './controllers/wishlist.controller';

const app = express();
const PORT = process.env.EXPRESS_APP_PORT;

app.use(cors({ 
  origin: process.env.REACT_APP_URL, 
  credentials: true 
}));
app.use(express.json({ limit: '2mb' }));

app.use('/albums', albumController.getRoutes());
app.use('/auth', authController.getRoutes());
app.use('/bundles', bundleController.getRoutes());
app.use('/carts', cartController.getRoutes());
app.use('/categories', categoryController.getRoutes());
app.use('/cities', cityController.getRoutes());
app.use('/events', eventController.getRoutes());
app.use('/faqs', faqController.getRoutes());
app.use('/items', itemController.getRoutes());
app.use('/orders', orderController.getRoutes());
app.use('/products', productController.getRoutes());
app.use('/reviews', reviewController.getRoutes());
app.use('/settings', settingController.getRoutes());
app.use('/vendors', vendorController.getRoutes());
app.use('/visits', visitController.getRoutes());
app.use('/wishlists', wishlistController.getRoutes());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
