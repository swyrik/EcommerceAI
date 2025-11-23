import { useState, useEffect } from 'react';
import { products } from './data/products';
import { ProductCard } from './components/ProductCard';
import AIAssistant from './components/AIAssistant';
import { CartSheet } from './components/CartSheet';
import { Input } from './components/ui/input';
import { Sparkles, Loader2 } from 'lucide-react';
import { useSemanticSearch } from './hooks/useSemanticSearch';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [semanticResults, setSemanticResults] = useState<string[]>([]);
  
  const { search, isReady, isModelLoading } = useSemanticSearch(products);

  // Perform semantic search when search term changes
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim() && isReady) {
        const results = await search(searchTerm);
        setSemanticResults(results);
      } else {
        setSemanticResults([]);
      }
    };
    
    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, isReady, search]);

  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const filteredProducts = products.filter(p => {
    // If we have semantic results, prioritize those
    if (searchTerm.trim() && semanticResults.length > 0) {
      const isSemanticMatch = semanticResults.includes(p.id);
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return isSemanticMatch && matchesCategory;
    }

    // Fallback to basic text search if model isn't ready or no semantic results
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort filtered products based on semantic rank if applicable
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (searchTerm.trim() && semanticResults.length > 0) {
      return semanticResults.indexOf(a.id) - semanticResults.indexOf(b.id);
    }
    return 0;
  });
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Lumina</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#" className="transition-colors hover:text-primary">Home</a>
            <a href="#" className="transition-colors hover:text-primary">Shop</a>
            <a href="#" className="transition-colors hover:text-primary">About</a>
            <a href="#" className="transition-colors hover:text-primary">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <CartSheet />
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-grow container px-4 md:px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Future of Shopping
          </h1>
          <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
            Experience the next generation of e-commerce with our AI-powered assistant. 
            Just ask to add items to your cart.
          </p>
        </section>

        {/* Product Grid */}
        <section className="flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
            <span className="text-sm text-muted-foreground">{sortedProducts.length} items</span>
            {isModelLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading AI Model...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-48"
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="border rounded p-1"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-auto bg-muted/50">
        <div className="container px-4 md:px-6 text-center text-muted-foreground">
          <p>&copy; 2025 Lumina Store. All rights reserved.</p>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}

export default App;
