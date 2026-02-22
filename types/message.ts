export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  imageUrl: string;
  description: string;
  postedAt:string | Date
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: Product[];
  createdAt: Date;
};
