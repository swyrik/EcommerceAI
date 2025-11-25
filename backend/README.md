# Spring Boot Solr Semantic Search

This application allows users to upload PDF documents, indexes them into Apache Solr with vector embeddings using LangChain4j, and performs semantic search.

## Prerequisites
- Java 17+
- Maven
- Apache Solr 9.7+

## Solr Setup

1. **Start Solr**:
   ```bash
   bin/solr start
   ```

2. **Create Collection**:
   ```bash
   bin/solr create -c documents
   ```

3. **Configure Schema**:
   You need to define the `knn_vector` field type and the fields in Solr. Run the following command (adjusting the URL if needed):

   ```bash
   curl -X POST http://localhost:8983/solr/documents/schema -H 'Content-type:application/json' --data-binary '{
     "add-field-type":{
       "name":"knn_vector",
       "class":"solr.DenseVectorField",
       "vectorDimension":384,
       "similarityFunction":"cosine"
     },
     "add-field":{
       "name":"vector",
       "type":"knn_vector",
       "indexed":true,
       "stored":true
     },
     "add-field":{
       "name":"text",
       "type":"text_general",
       "indexed":true,
       "stored":true,
       "multiValued":false
     },
     "add-field":{
       "name":"filename",
       "type":"string",
       "indexed":true,
       "stored":true
     }
   }'
   ```

   ```bash
   url.exe -X POST http://localhost:8983/solr/documents/schema -H "Content-type:application/json" --data-binary '{\"add-field-type\":{\"name\":\"knn_vector\",\"class\":\"solr.DenseVectorField\",\"vectorDimension\":384,\"similarityFunction\":\"cosine\"},\"add-field\":{\"name\":\"vector\",\"type\":\"knn_vector\",\"indexed\":true,\"stored\":true},\"add-field\":{\"name\":\"text\",\"type\":\"text_general\",\"indexed\":true,\"stored\":true,\"multiValued\":false},\"add-field\":{\"name\":\"filename\",\"type\":\"string\",\"indexed\":true,\"stored\":true}}'
   ```

  

## Running the Application

1. Navigate to the `backend` directory.
2. Run with Maven:
   ```bash
   mvn spring-boot:run
   ```
   *Note: On the first run, it will download the embedding model (~90MB).*

## Usage

### Upload Document
```bash
curl.exe -F "file=@c:\Users\GRAVITY\.gemini\antigravity\scratch\documents\Biotechnology and Bioengineering.pdf" http://localhost:8080/api/upload
```


### Search
```bash
curl "http://localhost:8080/api/search?q=your+search+query"
```
