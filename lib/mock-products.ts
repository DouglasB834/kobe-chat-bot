import type { Product } from "@/types/message";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Relógio de Couro Classic",
    description:
      "Relógio elegante com pulseira em couro legítimo, resistência à água e mecanismo de alta precisão. Ideal para ocasiões formais e uso diário.",
    originalPrice: 329.9,
    price: 249.9,
    rating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    postedAt: "2026-02-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Relógio Esportivo",
    description:
      "Modelo esportivo com visor digital, cronômetro, iluminação noturna e resistência a impactos. Perfeito para treinos e aventuras.",
    originalPrice: 279.0,
    price: 189.0,
    rating: 4.8,
    imageUrl:
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop",
    postedAt: "2026-02-18T14:00:00Z",
  },
  {
    id: "3",
    name: "Relógio Minimalista",
    description:
      "Design clean e sofisticado com acabamento metálico escovado. Combina com qualquer estilo, do casual ao social.",
    price: 319.0,
    rating: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    postedAt: "2026-02-20T09:15:00Z",
  },
  {
    id: "4",
    name: "Kit Camisa  Marrom",
    description:
      "camisa premium com reforçada e acabamento artesanal. Ideal para compor looks sociais e casuais.",
    originalPrice: 129.9,
    price: 99.9,
    rating: 4.2,
    imageUrl:
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    postedAt: "2026-02-10T16:45:00Z",
  },
  {
    id: "5",
    name: "Bolsa Feminina",
    description:
      "Bolsa elegante com amplo espaço interno, compartimentos organizadores e acabamento premium. Ideal para o dia a dia.",
    originalPrice: 249.0,
    price: 179.0,
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    postedAt: "2026-02-12T11:20:00Z",
  },
  {
    id: "6",
    name: "Carteira Masculina Slim",
    description:
      "Carteira compacta em couro legítimo com divisórias inteligentes para cartões e notas. Design minimalista e funcional.",
    originalPrice: 119.9,
    price: 89.9,
    rating: 4.4,
    imageUrl:
      "https://images.unsplash.com/photo-1616627988453-3b4bda8b368c?w=400&h=400&fit=crop",
    postedAt: "2026-02-08T13:10:00Z",
  },
  {
    id: "7",
    name: "Óculos de Sol Premium",
    description:
      "Óculos com proteção UV400, armação resistente e design moderno. Ideal para proteger seus olhos com estilo.",
    originalPrice: 199.9,
    price: 149.9,
    rating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
    postedAt: "2026-02-17T17:40:00Z",
  },
  {
    id: "8",
    name: "Mochila Casual Urbana",
    description:
      "Mochila resistente com compartimento para notebook, bolsos organizadores e material impermeável.",
    price: 219.0,
    rating: 4.3,
    imageUrl:
      "https://images.unsplash.com/photo-1509762774605-f07235a08f1f?w=400&h=400&fit=crop",
    postedAt: "2026-02-05T09:00:00Z",
  },
  {
    id: "9",
    name: "Tênis Casual Masculino",
    description:
      "Tênis confortável com sola antiderrapante e acabamento premium. Ideal para uso diário.",
    originalPrice: 349.9,
    price: 279.9,
    rating: 4.6,
    imageUrl:
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    postedAt: "2026-02-19T12:25:00Z",
  },
  {
    id: "10",
    name: "Jaqueta Jeans Moderna",
    description:
      "Jaqueta jeans com corte ajustado, bolsos funcionais e acabamento premium. Perfeita para meia-estação.",
    originalPrice: 399.0,
    price: 299.0,
    rating: 4.9,
    imageUrl:
    "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=400&fit=crop",
    postedAt: "2026-02-14T18:00:00Z",
  },
];

function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

const SHOW_ALL_INTENTS = [
  "sim",
  "1",
  "por favor",
  "porfavor",
  "quero ver todos",
  "mostre todos",
  "mostrar todos",
  "ver todos",
  "todos",
  "ver tudo",
  "tudo",
  "pode ser",
  "ok",
  "quero",
  "mostre",
  "pode mostrar",
];

export function isShowAllProductsIntent(text: string): boolean {
  const normalized = removeAccents(text.trim().toLowerCase());
  if (!normalized) return false;
  return SHOW_ALL_INTENTS.some((intent) => normalized === intent || normalized.startsWith(intent + " ") || normalized.endsWith(" " + intent));
}

export function getAllProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function searchProducts(query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return MOCK_PRODUCTS;

  const termNormalized = removeAccents(term);
  return MOCK_PRODUCTS.filter((p) =>
    removeAccents(p.name.toLowerCase()).includes(termNormalized)
  );
}
