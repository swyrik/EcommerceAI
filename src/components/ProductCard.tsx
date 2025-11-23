import type { Product } from '../data/products';
import { Card, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useCartStore } from '../store/cart-store';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">{product.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            ${product.price.toFixed(2)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {product.description}
        </p>
      </CardHeader>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button 
          className="w-full font-medium" 
          onClick={() => addItem(product)}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
