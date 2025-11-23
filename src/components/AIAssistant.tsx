import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Bot, Send, X, MessageSquare } from 'lucide-react';
import { useCartStore } from '../store/cart-store';
import { products } from '../data/products';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const { addItem, removeItem, clearCart, items } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hi! I can help you shop. You can ask me to search for products, check prices, or manage your cart.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Advanced AI Logic
    setTimeout(() => {
      const lowerInput = userMessage.content.toLowerCase();
      let responseContent = "I'm not sure I understand. Try asking me to search for products, check prices, or add items to your cart.";

      // 1. Clear Cart
      if (lowerInput.includes('clear') && lowerInput.includes('cart')) {
        clearCart();
        responseContent = "I've cleared your shopping cart.";
      }
      // 2. View Cart
      else if ((lowerInput.includes('what') && lowerInput.includes('cart')) || lowerInput === 'view cart') {
        if (items.length === 0) {
          responseContent = "Your cart is currently empty.";
        } else {
          const itemNames = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
          responseContent = `You have: ${itemNames} in your cart.`;
        }
      }
      // 3. Checkout
      else if (lowerInput.includes('checkout') || lowerInput.includes('buy now')) {
        if (items.length === 0) {
          responseContent = "Your cart is empty. Add some items before checking out!";
        } else {
          responseContent = "Proceeding to checkout... (This is a demo, so no real payment is processed!)";
        }
      }
      // 4. Remove Item
      else if (lowerInput.includes('remove') || lowerInput.includes('delete')) {
        const productToRemove = items.find(i => lowerInput.includes(i.name.toLowerCase()));
        if (productToRemove) {
          removeItem(productToRemove.id);
          responseContent = `Removed ${productToRemove.name} from your cart.`;
        } else {
          responseContent = "I couldn't find that item in your cart to remove.";
        }
      }
      // 5. Price Query
      else if (lowerInput.includes('price') || lowerInput.includes('how much') || lowerInput.includes('cost')) {
        const product = products.find(p => lowerInput.includes(p.name.toLowerCase()) || lowerInput.includes(p.category.toLowerCase()));
        if (product) {
          responseContent = `The ${product.name} costs $${product.price.toFixed(2)}.`;
        } else {
          responseContent = "Which product's price would you like to know?";
        }
      }
      // 6. Search / Show
      else if (lowerInput.includes('show') || lowerInput.includes('find') || lowerInput.includes('search') || lowerInput.includes('looking for')) {
        const categoryOrName = lowerInput.replace(/show|find|search|looking|for|me/g, '').trim();
        const foundProducts = products.filter(p => 
          p.name.toLowerCase().includes(categoryOrName) || 
          p.category.toLowerCase().includes(categoryOrName)
        );
        
        if (foundProducts.length > 0) {
          const names = foundProducts.map(p => p.name).join(', ');
          responseContent = `I found these for "${categoryOrName}": ${names}.`;
        } else {
          responseContent = `I couldn't find any products matching "${categoryOrName}".`;
        }
      }
      // 7. Add to Cart
      else if (lowerInput.includes('add') || lowerInput.includes('buy')) {
        // Better matching logic for "add headphones"
        const matchedProduct = products.find(p => {
            const nameParts = p.name.toLowerCase().split(' ');
            return nameParts.some(part => lowerInput.includes(part) && part.length > 3);
        });

        if (matchedProduct) {
          addItem(matchedProduct);
          responseContent = `Added ${matchedProduct.name} to your cart.`;
        } else {
          responseContent = "I couldn't find that product to add. Please be specific.";
        }
      }
      // 8. Greetings
      else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        responseContent = "Hello! I can help you find products, check prices, or manage your cart.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  return (
    <>
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-xl z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-10 fade-in">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-primary text-primary-foreground rounded-t-xl">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-base">Shopping Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/90" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex w-full gap-2"
            >
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
