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
  price: number;
  capacity: number | null;
  description: string | null;
  eventImage: string | null;
  isDeleted: boolean;
  bundles: string | null;
  rating: number;
  reviewCount: number;
};

interface ItemEventDetail {
  id: number;
  cartId: number;
  eventId: number;
  eventName: string;
  eventPrice: number;
  eventDescription: string | null;
  eventImage: string | null;
  eventBundles: string | null;
  eventRating: number;
  categoryName: string;
  categoryFee: number;
  isReviewed: boolean;
};

interface ItemProductDetail {
  id: number;
  cartId: number;
  productId: number;
  productName: string;
  productSpecification: string;
  productPrice: number;
  productImage: string | null;
  productRating: number;
  vendorId: number;
  vendorAddress: string;
  categoryName: string;
  categoryFee: number;
  duration: number | null;
  quantity: number | null;
  isReviewed: boolean;
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
  orderTotal: number;
  orderStatus: string;
};

interface ProductDetail {
  id: number;
  vendorId: number;
  vendorName: string;
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
  cartId: number;
  userId: number;
  userName: string;
  userPicture: string | null;
  eventId: number | null;
  productId: number | null;
  rating: number;
  comment: string | null;
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

interface WishlistEventDetail {
  id: number;
  userId: number;
  eventId: number;
  eventName: string;
  eventPrice: number;
  eventDescription: string | null;
  eventImage: string | null;
  eventBundles: string | null;
  eventRating: number;
};

interface WishlistProductDetail {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productSpecification: string;
  productRate: string;
  productPrice: number;
  productImage: string | null;
  productRating: number;
  vendorId: number;
  vendorAddress: string;
};

export type { CustomRequest, EventDetail, ItemEventDetail, ItemProductDetail, OrderDetail, ProductDetail, ReviewDetail, VendorDetail, WishlistEventDetail, WishlistProductDetail };
