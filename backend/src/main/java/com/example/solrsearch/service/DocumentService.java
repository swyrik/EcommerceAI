package com.example.solrsearch.service;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.common.SolrInputDocument;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.pdf.PDFParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final SolrClient solrClient;
    private final EmbeddingService embeddingService;

    @Value("${solr.collection}")
    private String collection;

    public DocumentService(SolrClient solrClient, EmbeddingService embeddingService) {
        this.solrClient = solrClient;
        this.embeddingService = embeddingService;
    }

    public void uploadDocument(MultipartFile file) throws Exception {
        // 1. Parse PDF
        BodyContentHandler handler = new BodyContentHandler(-1); // -1 for unlimited write limit
        Metadata metadata = new Metadata();
        InputStream inputstream = file.getInputStream();
        ParseContext pcontext = new ParseContext();

        PDFParser pdfparser = new PDFParser();
        pdfparser.parse(inputstream, handler, metadata, pcontext);
        String text = handler.toString();

        // 2. Generate Embedding
        // Note: For a real app, you might want to chunk the text if it's too long.
        // Solr's DenseVectorField doesn't care about text length, but the embedding model has a token limit (e.g. 256 or 384 tokens).
        // For simplicity in this demo, we'll take the first 500 characters or so, or rely on the model to truncate.
        // AllMiniLmL6V2 has a limit. Let's truncate to be safe or just pass it and let it handle/truncate.
        // Better to truncate to a reasonable length for the "summary" vector.
        String textToEmbed = text.length() > 1000 ? text.substring(0, 1000) : text;
        List<Float> vector = embeddingService.generateEmbedding(textToEmbed);

        // 3. Index to Solr
        SolrInputDocument doc = new SolrInputDocument();
        doc.addField("id", UUID.randomUUID().toString());
        doc.addField("text", text);
        doc.addField("vector", vector);
        doc.addField("filename", file.getOriginalFilename());

        solrClient.add(collection, doc);
        solrClient.commit(collection);
    }
}
