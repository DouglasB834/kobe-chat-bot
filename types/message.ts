export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: Product[];
  createdAt: Date;
};
