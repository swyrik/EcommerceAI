import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Loader2, Upload, Search, FileText } from 'lucide-react';

interface SearchResult {
  id: string;
  text: string;
  filename: string;
  score: number;
}

export function DocumentSearchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadMessage('Document uploaded successfully!');
        setFile(null);
      } else {
        const text = await response.text();
        setUploadMessage(`Upload failed: ${text}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage('Upload failed. Is the backend running?');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container px-4 md:px-6 py-8 max-w-4xl mx-auto space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Document Knowledge Base</h1>
        <p className="text-muted-foreground">
          Upload PDF documents and perform semantic search to find relevant information.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-card border rounded-lg p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Document
        </h2>
        <div className="flex gap-4 items-center">
          <Input 
            type="file" 
            accept=".pdf"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button 
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Upload
          </Button>
        </div>
        {uploadMessage && (
          <p className={`text-sm ${uploadMessage.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {uploadMessage}
          </p>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-card border rounded-lg p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5" />
            Semantic Search
          </h2>
          <div className="flex gap-4">
            <Input
              placeholder="Ask a question or search for a topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Search
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div key={result.id} className="border rounded-md p-4 space-y-2 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium flex items-center gap-2 text-primary">
                    <FileText className="h-4 w-4" />
                    {result.filename}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Score: {result.score.toFixed(4)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {result.text}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {isSearching ? 'Searching...' : 'No results found. Try a different query.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
