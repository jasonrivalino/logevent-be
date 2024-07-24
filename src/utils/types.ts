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

interface ProductDetails {
  id: number;
  vendorId: number;
  vendorPhone: string;
  vendorAddress: string;
  categoryId: number;
  categoryName: string;
  name: string;
  specification: string;
  price: number;
  description: string | null;
  productImage: string | null;
  rating: number;
  reviewCount: number;
};

interface VendorDetails {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  instagram: string | null;
  socialMedia: string | null;
  documentUrl: string;
  joinDate: Date;
  isDeleted: boolean;
  productCount: number;
};

export type { CustomRequest, ItemDetails, OrderDetails, ProductDetails, VendorDetails };
