import { useState, useEffect, useCallback } from 'react';
import { pipeline, env } from '@xenova/transformers';
import type { Product } from '../data/products';

// Skip local model check
env.allowLocalModels = false;

// Singleton to hold the pipeline
let extractor: any = null;

interface SemanticSearchState {
  isModelLoading: boolean;
  isEmbedding: boolean;
  error: string | null;
}

export function useSemanticSearch(products: Product[]) {
  const [state, setState] = useState<SemanticSearchState>({
    isModelLoading: true,
    isEmbedding: false,
    error: null,
  });
  const [productEmbeddings, setProductEmbeddings] = useState<any[]>([]);

  // Initialize the model
  useEffect(() => {
    const initModel = async () => {
      try {
        if (!extractor) {
          extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }
        setState(prev => ({ ...prev, isModelLoading: false, isEmbedding: true }));
        
        // Generate embeddings for products
        const embeddings = await Promise.all(
          products.map(async (product) => {
            const text = `${product.name} ${product.description} ${product.category}`;
            const output = await extractor(text, { pooling: 'mean', normalize: true });
            return {
              id: product.id,
              embedding: output.data,
            };
          })
        );
        
        setProductEmbeddings(embeddings);
        setState(prev => ({ ...prev, isEmbedding: false }));
      } catch (err) {
        console.error('Error loading model:', err);
        setState(prev => ({ ...prev, isModelLoading: false, error: 'Failed to load AI model' }));
      }
    };

    initModel();
  }, [products]);

  const search = useCallback(async (query: string) => {
    if (!extractor || productEmbeddings.length === 0) return [];

    const output = await extractor(query, { pooling: 'mean', normalize: true });
    const queryEmbedding = output.data;

    // Calculate cosine similarity
    const results = productEmbeddings.map(item => {
      const similarity = cosineSimilarity(queryEmbedding, item.embedding);
      return { id: item.id, score: similarity };
    });

    // Sort by score
    return results
      .sort((a, b) => b.score - a.score)
      .filter(r => r.score > 0.2) // Threshold
      .map(r => r.id);
  }, [productEmbeddings]);

  return {
    search,
    isReady: !state.isModelLoading && !state.isEmbedding,
    ...state
  };
}

function cosineSimilarity(a: Float32Array, b: Float32Array) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
