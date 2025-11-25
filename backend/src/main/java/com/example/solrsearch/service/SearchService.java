package com.example.solrsearch.service;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private final SolrClient solrClient;
    private final EmbeddingService embeddingService;

    @Value("${solr.collection}")
    private String collection;

    public SearchService(SolrClient solrClient, EmbeddingService embeddingService) {
        this.solrClient = solrClient;
        this.embeddingService = embeddingService;
    }

    public List<Map<String, Object>> search(String queryText) throws Exception {
        // 1. Generate embedding for the query
        List<Float> vector = embeddingService.generateEmbedding(queryText);
        String vectorString = vector.toString(); // [0.1, 0.2, ...]

        // 2. Construct KNN Query
        // Syntax: {!knn f=vector topK=10}[0.1, 0.2, ...]
        String knnQuery = String.format("{!knn f=vector topK=10}%s", vectorString);

        SolrQuery query = new SolrQuery();
        query.setQuery(knnQuery);
        query.setFields("id", "text", "filename", "score");
        query.setRows(10);

        // 3. Execute Search
        QueryResponse response = solrClient.query(collection, query);
        SolrDocumentList results = response.getResults();

        // 4. Map results
        List<Map<String, Object>> mappedResults = new ArrayList<>();
        for (SolrDocument doc : results) {
            Map<String, Object> docMap = new java.util.HashMap<>();
            for (String fieldName : doc.getFieldNames()) {
                docMap.put(fieldName, doc.getFieldValue(fieldName));
            }
            mappedResults.add(docMap);
        }

        return mappedResults;
    }
}
