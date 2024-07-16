import { Request } from 'express';

interface CustomRequest extends Request {
  user: any;
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
  rating: number | null;
  reviewCount: number;
};

export type { CustomRequest, ProductDetails };
