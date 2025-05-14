export interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  src: string;
}

export interface Product {
  id: number;
  title: string;
  variants: Variant[];
  image?: ProductImage;
}

export interface VariantWithDiscount extends Variant {
  discountValue: string;
  discountType: 'flat' | 'percentage';
  showDiscount?: boolean;
}

export interface ProductWithDiscount extends Product {
  variants: VariantWithDiscount[];
  discountValue: string;
  discountType: 'flat' | 'percentage';
  variantsVisible: boolean;
  showDiscount?: boolean;
  empty?: boolean;
}

export interface ApiResponse {
  data: Product[];
  totalCount: number;
}