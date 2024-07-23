// src/utils/types.ts

// dependency modules
import { Request } from 'express';

interface CustomRequest extends Request {
  user: any;
}

interface ItemDetails {
  id: number;
  productId: number;
  orderId: number;
  userName: string;
  userPicture: string | null;
  reviewRating: number | null;
  reviewComment: string | null;
  reviewDate: Date | null;
}

interface ProductDetails {
  id: number;
  vendorId: number;
  vendorAddress: string;
  name: string;
  specification: string;
  category: string;
  price: number;
  description: string | null;
  productImage: string | null;
  rating: number;
  reviewCount: number;
};

interface OrderDetails {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  userPhone: string | null;
  address: string;
  startDate: Date;
  endDate: Date;
  orderDate: Date;
  orderStatus: string | null;
};

export type { CustomRequest, ItemDetails, ProductDetails, OrderDetails };
