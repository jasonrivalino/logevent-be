// src/utils/types.ts

// dependency modules
import { Request } from 'express';

interface CustomRequest extends Request {
  user: any;
}

interface EventDetail {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  rate: string;
  price: number;
  capacity: number | null;
  description: string | null;
  eventImage: string | null;
  isDeleted: boolean;
  bundles: string | null;
  rating: number;
  reviewCount: number;
};

interface ItemDetail {
  id: number;
  eventId: number | null;
  productId: number | null;
  cartId: number;
  duration: number | null;
  quantity: number | null;
  orderRange: number;
  subtotal: number;
};

interface OrderDetail {
  id: number;
  cartId: number;
  cartType: string;
  userId: number;
  userEmail: string;
  userName: string;
  userPhone: string | null;
  name: string;
  phone: string;
  address: string;
  notes: string | null;
  startDate: Date;
  endDate: Date;
  orderDate: Date;
  orderStatus: string | null;
  orderTotal: number;
};

interface ProductDetail {
  id: number;
  vendorId: number;
  vendorPhone: string;
  vendorAddress: string;
  categoryId: number;
  categoryName: string;
  name: string;
  specification: string;
  rate: string;
  price: number;
  capacity: number | null;
  description: string | null;
  productImage: string | null;
  isDeleted: boolean;
  rating: number;
  reviewCount: number;
};

interface ReviewDetail {
  id: number;
  itemId: number;
  eventId: number | null;
  productId: number | null;
  cartId: number;
  userId: number;
  userName: string;
  userPicture: string | null;
  rating: number;
  comment: string;
  tag: string | null;
  reviewDate: Date;
};

interface VendorDetail {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  instagram: string | null;
  socialMedia: string | null;
  documentUrl: string | null;
  joinDate: Date;
  isDeleted: boolean;
  productCount: number;
};

export type { CustomRequest, EventDetail, ItemDetail, OrderDetail, ProductDetail, ReviewDetail, VendorDetail };
