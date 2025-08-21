export interface Product {
    sku: string;
    name: string;
    price: number;
    rrp: number;
    image: string;
}

export interface ProductsResponse {
    products: Product[];
}