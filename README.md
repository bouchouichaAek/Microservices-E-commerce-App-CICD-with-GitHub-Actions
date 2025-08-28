# 🛒 Microservices E-commerce App – CI/CD with GitHub Actions

## 📌 Overview

This project demonstrates a **Microservices-based E-commerce Application** with a full **CI/CD pipeline** using **GitHub Actions**.

The pipeline automates the process of:

1. Building and testing each microservice.
2. Creating and pushing **Docker images** to Docker Hub.
3. Deploying the application to a **Kubernetes cluster** _(or Docker Compose for local setup)_.

This setup reflects a **real-world DevOps workflow** for scalable microservices applications.

---

## 🛠️ Tech Stack

- **Architecture**: Microservices
- **Backend Services**:
  - Auth Service (Node.js/Express)
  - Product Service (Node.js/Express)
  - Order Service (Node.js/Express)
  - Payment Service (Node.js/Express)
  - Notification Service (Node.js/Express)
- **Database**: MySQL or PostgreSQL
- **Containerization**: Docker
- **Orchestration**: Kubernetes (Minikube / AKS / EKS) _(optional: Docker Compose for local)_
- **CI/CD**: GitHub Actions

---

## ⚙️ Features

- Microservices communicate via REST APIs.
- Each service has its own **Dockerfile**.
- CI/CD pipeline runs on every push/pull request.
- Automated tests for each service.
- Multi-service deployment using Docker Compose (local) or Kubernetes (production).

---

## 📂 Project Structure

```bash
.
├── services/
│   ├── auth-service/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   ├── notification-service/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   ├── order-service/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   ├── payment-service/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   └── product-service/
│       ├── Dockerfile
│       ├── index.js
│       └── package.json
│
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│
├── .github/workflows/
│   └── ci-cd.yml
│
└── README.md

```

## ℹ️ Note

Each microservice internally follows a clean layered structure with:

- `Controllers/` → request handlers & business logic
- `models/` → database models
- `routes/` → API route definitions
- `middlewares/` → authentication, validation, logging
- `config/` → environment & database configs
- `utils/` → helper utilities
- `test/` → unit & integration tests

## 🚀 Run Locally (Docker Compose)

```bash
# 1. Clone repo
git clone https://github.com/bouchouichaAek/Microservices-E-commerce-App-CI-CD-with-GitHub-Actions.git
cd microservices-ecommerce

# 2. Build & start services
docker-compose up --build
```

Application runs on:

- User Service → `http://localhost:5001`
- Product Service → `http://localhost:5002`
- Order Service → `http://localhost:5003`

---

## 🔄 CI/CD Pipeline

- **Trigger:** Push to `main` or PR.
- **Steps:**
  1. Checkout repository.
  2. Build and test each microservice.
  3. Build Docker images and tag with commit hash.
  4. Push images to Docker Hub.
  5. Deploy to Kubernetes cluster (using `kubectl` & GitHub secrets).

Workflow file: [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)

---

## 🖥️ Deployment Options

1. **Local** → `docker-compose up`
2. **Kubernetes** →
   ```bash
   kubectl apply -f k8s/
   kubectl get pods
   ```

---

## 📊 Demo

👉 _[Add screenshot of Docker Compose running]_  
👉 _[Add screenshot of GitHub Actions successful pipeline]_  
👉 _[Optional: Screenshot of services in Kubernetes]_

---

## 📌 Future Improvements

- Add service discovery with API Gateway.
- Integrate monitoring (Prometheus + Grafana).
- Add centralized logging (ELK Stack).
- Implement staging environment before production.

---

## 👨‍💻 Author

**Abdelkader Bouchouicha** – Junior DevOps Engineer 🚀

- GitHub: [bouchouichaAek](https://github.com/bouchouichaAek)
- LinkedIn: [abdelkader-bouchouicha](https://linkedin.com/in/abdelkader-bouchouicha)
