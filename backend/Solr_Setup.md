Install rancher desktop

Enable WSL 


wsl --install

install helm using winget

winget install Helm.Helm



1) Install or upgrade the solr operator

add the repo first 
helm repo add apache-solr https://solr.apache.org/charts

now install using below command

helm install solr-operator apache-solr/solr-operator --version 0.9.1 --create-namespace --namespace solr-system


create a yaml file and name it solr-9-10.yaml
```YAML
apiVersion: solr.apache.org/v1beta1
kind: SolrCloud
metadata:
  name: my-solr-cluster
  namespace: default
spec:
  # Explicitly set Solr 9.10.0
  solrImage:
    tag: 9.7.0
    repository: solr

  # Number of Solr Nodes
  replicas: 3

  solrJavaMem: "-Xms1g -Xmx1g"

  # Zookeeper configuration (managed automatically by the operator)
  zookeeperRef:
    provided:
      chroot: /my-solr-cluster
      replicas: 3

  # Solr Options
  customSolrKubeOptions:
    podOptions:
      resources:
        requests:
          cpu: "500m"
          memory: "1.5Gi"
```


Apply the yaml file 
-------------------
kubectl apply -f solr-9-10.yaml



SolrCloud uses pravega zookeeper inside.

Wait for deployment and check 

kubectl get solrcloud -w


Port forward

kubectl port-forward service/my-solr-cluster-solrcloud-common 8983:80