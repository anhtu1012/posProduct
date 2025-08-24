export interface CartItem {
  id: string;
  name: string;
  categoryId: string;
  image: string;
  price: string;
  discountPercent?: string;
  description: string;
  quantity: number;
}
