export interface BaseModel {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    url: string;
    isPrimary: boolean;
}

export interface User extends BaseModel {
    email: string;
    fullname: string;
    avatar: string;
    phone: string;
    address: Address[];
    role: 'Admin' | 'User';
}

export interface Address {
    isPrimary: boolean;
    address: string;
}

export interface Product extends BaseModel {
    name: string;
    price: number;
    description: string;
    image: Image[];
    category: Category;
    rating: number;
    soldCount: number;
}

export interface Category extends BaseModel {
    name: string;
    products: Product[];
    image: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart extends BaseModel {
    items: CartItem[];
    user?: User;
    state?: "active" | "completed" | "cancelled" | "pending";
}