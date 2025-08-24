export interface Product {
  id: string;
  name: string;
  categoryId: string;
  image: string;
  price: string;
  discountPercent?: number;
  description: string;
  rating: number;
  reviews: number;
}
