/* eslint-disable @next/next/no-img-element */
"use client";

import type { Product } from "@/types/message";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { isLancamento } from "@/lib/date-utils";

const STAR_SIZE = 14;

function StarRating({ value }: { value: number }) {
  const clamped = Math.min(5, Math.max(0, value));
  const full = Math.floor(clamped);
  const hasHalf = clamped % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Avaliação: ${value.toFixed(1)} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= full) {
          return (
            <Image
              key={i}
              src="/starts.png"
              alt=""
              width={STAR_SIZE}
              height={STAR_SIZE}
              className="size-[14px] shrink-0 object-contain"
            />
          );
        }
        if (i === full + 1 && hasHalf) {
          return (
            <Image
              key={i}
              src="/rating.png"
              alt=""
              width={STAR_SIZE}
              height={STAR_SIZE}
              className="size-[14px] shrink-0 object-contain"
            />
          );
        }
        return (
          <Image
            key={i}
            src="/starts.png"
            alt=""
            width={STAR_SIZE}
            height={STAR_SIZE}
            className="size-[14px] shrink-0 object-contain opacity-30"
          />
        );
      })}
    </div>
  );
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPrice != null && product.originalPrice > product.price;

  const showLancamento = product.postedAt != null && isLancamento(product.postedAt,7);

  return (
    <div
      className="flex sm:flex-col bg-transparent w-full h-auto  max-w-[304px] sm:max-w-[168px]   p-3 gap-2"
    >
      <div className="relative mx-auto  w-36  min-w-[144px] min-h-[144px] overflow-hidden rounded-t-md bg-zinc-800">
        {
          showLancamento && (
          <Badge className="absolute top-0 left-0 rounded-none w-full bg-bubble-assistant uppercase font-medium text-secondary-foreground text-xs">
            Lançamento
          </Badge>
          )
        }
        <img
          src={product?.imageUrl ?? "/productImage.png"}
          alt={product?.name}
          title={product?.name}
          width={144}
          height={144}
          sizes="144px"
          className="size-full object-cover rounded-b-md"
        />
        <div className="absolute bottom-0 right-0 z-10 bg-bubble-assistant p-1 rounded-sm">
          <Image
            src="/shopping.png"
            title="bag add cart"
            alt="shopping bag"
            width={24}
            height={24}
            className="object-contain cursor-pointer"
          />
        </div>
      </div>
    
      <CardContent className="text-start px-0! space-y-2 pb-0! " aria-label="product name">
        <p className="font-bold pb-3 text-secondary text-sm" title={product?.name}>
          {product?.name && product.name.length > 38
            ? product.name.slice(0, 50) + "..."
            : product?.name}
        </p>
        <div className=" space-y-0.5">
          {hasDiscount && (
            <p className="text-xs text-secondary  line-through" aria-label="orginal price">
              {formatPrice(product.originalPrice!)}
            </p>
          )}
          <p className="text-sm font-bold text-secondary" aria-label="off price">
            {formatPrice(product?.price)}
          </p>
        </div>
        {product.rating != null && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <StarRating value={product?.rating} />
            <span className="text-xs text-muted-foreground">
              {product?.rating.toFixed(1)}
            </span>
          </div>
        )}
      </CardContent>
    </div>
  );
}
