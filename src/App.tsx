import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartSheet } from './components/CartSheet';
import { Sparkles } from 'lucide-react';
import AIAssistant from './components/AIAssistant';
import { HomePage } from './pages/HomePage';
import { DocumentSearchPage } from './pages/DocumentSearchPage';

function App() {
  return (
    <Router>
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
              <Link to="/" className="transition-colors hover:text-primary">Shop</Link>
              <Link to="/documents" className="transition-colors hover:text-primary">Documents</Link>
              <a href="#" className="transition-colors hover:text-primary">About</a>
              <a href="#" className="transition-colors hover:text-primary">Contact</a>
            </nav>
            <div className="flex items-center gap-4">
              <CartSheet />
            </div>
          </div>
        </header>

        <main className="flex flex-col flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documents" element={<DocumentSearchPage />} />
          </Routes>
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
    </Router>
  );
}

export default App;
