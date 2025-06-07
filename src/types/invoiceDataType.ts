export interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  value: number;
}

export interface InvoiceData {
  buyer_name: string;
  buyer_addr: string;
  product_data: ProductItem[];
  created_at: Date;
}