package com.example.solrsearch.config;

import org.apache.solr.client.solrj.impl.HttpJdkSolrClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SolrConfig {

    @Value("${solr.url}")
    private String solrUrl;

    @Bean
    public HttpJdkSolrClient solrClient() {
        return new HttpJdkSolrClient.Builder(solrUrl).build();
    }
}
