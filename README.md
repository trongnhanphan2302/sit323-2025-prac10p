# Cloud Native Monitoring Example (SIT323/SIT737 10.1P)

---

## Project Structure

```
sit323-2025-prac10p/
├── app/
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── k8s/
│   ├── deployment.yaml
│   └── mongo-deployment.yaml
└── README.md
```

---

## 1. Build and Test Locally

### a. Initialize Node.js App

```sh
mkdir sit323-2025-prac10p
cd sit323-2025-prac10p
mkdir app
cd app
npm init -y
npm install express mongoose
```

Add your application code in `app/index.js`.

### b. Test Locally with Docker Compose

- In the root, create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  app:
    build: ./app
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/mydb
    depends_on:
      - mongo
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

- Run:

```sh
docker-compose up
```
- Visit [http://localhost:3000](http://localhost:3000).

---

## 2. Containerize & Push to Google Container Registry (GCR)

- Authenticate Docker to GCP:

```sh
gcloud auth configure-docker
```

- Build and push:

```sh
docker build -t my-node-app ./app
docker tag my-node-app gcr.io/<YOUR_PROJECT_ID>/cloud-native-monitoring:latest
docker push gcr.io/<YOUR_PROJECT_ID>/cloud-native-monitoring:latest
```

---

## 3. Prepare Kubernetes Manifests

- **App Deployment and Service:**  
  Edit `k8s/deployment.yaml` to use your image and set the correct ports.
- **MongoDB Deployment:**  
  Edit `k8s/mongo-deployment.yaml`.

---

## 4. Deploy to GKE

- Create a Kubernetes Cluster in the GCP Console.
- Fetch credentials:

```sh
gcloud container clusters get-credentials <CLUSTER_NAME> --region <REGION>
```

- Deploy resources:

```sh
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/deployment.yaml
```

- Get the external IP:

```sh
kubectl get svc
```
Visit your app at the `EXTERNAL-IP` of the `node-app-service`.

---

## 5. Monitoring & Logging

Google Kubernetes Engine integrates with Google Cloud Operations Suite by default.

- **Monitoring:**  
  GCP Console → Monitoring → Metrics Explorer  
  View CPU, memory, pod health, and custom dashboards.

- **Logging:**  
  GCP Console → Logging → Logs Explorer  
  View logs from your Node.js app and MongoDB.

- (Optional) Create alerts in Monitoring for pod restarts or high CPU/memory.

---

## 6. Clean Up

To avoid unnecessary charges, **delete your GKE cluster and any associated resources** after you finish the assignment.

---

## 7. References

- [GKE Quickstart](https://cloud.google.com/kubernetes-engine/docs/quickstart)
- [Google Cloud Monitoring](https://cloud.google.com/monitoring/kubernetes-engine)
- [Google Cloud Logging](https://cloud.google.com/logging/docs)

