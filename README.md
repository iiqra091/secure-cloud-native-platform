# Secure Cloud-Native CI/CD Platform

### DevOps for Cloud Computing — BSE-8B Final Lab Project

> End-to-End DevOps & DevSecOps Platform with Monitoring, Containerization, Orchestration, IaC, and Automated Security

---

## Project Architecture

```
Developer → Git Repository → GitHub Actions/Jenkins → Build & Test
         → Security Scan → Docker Build → Push to Registry
         → Kubernetes Deployment → Monitoring & Alerts
```

---

## Modules Implemented

| #   | Module                   | Tools                     | Status |
| --- | ------------------------ | ------------------------- | ------ |
| 1   | Version Control System   | Git, GitHub               | ✅     |
| 2   | CI/CD Pipeline           | GitHub Actions, Jenkins   | ✅     |
| 3   | Docker Containerization  | Docker, Docker Compose    | ✅     |
| 4   | Kubernetes Orchestration | K8s, Minikube/EKS         | ✅     |
| 5   | Infrastructure as Code   | Terraform (AWS)           | ✅     |
| 6   | Configuration Management | Ansible                   | ✅     |
| 7   | Monitoring & Logging     | Prometheus, Grafana, Loki | ✅     |
| 8   | DevSecOps Security       | Trivy, SonarQube, RBAC    | ✅     |

---

## Project Structure

```
project-root/
├── frontend/               # Nginx + HTML/CSS/JS (Student UI)
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── nginx.conf
│   └── Dockerfile
├── backend/                # Node.js Express API
│   ├── server.js
│   ├── server.test.js
│   ├── package.json
│   └── Dockerfile
├── kubernetes/             # K8s manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ingress.yaml
│   └── persistent-volume.yaml
├── terraform/              # IaC — AWS provisioning
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── scripts/bootstrap.sh
├── ansible/                # Configuration management
│   ├── inventory.ini
│   ├── install-docker.yml
│   ├── install-kubernetes.yml
│   └── configure-jenkins.yml
├── monitoring/             # Prometheus + Grafana + Loki
│   ├── prometheus.yml
│   ├── alert-rules.yml
│   ├── alertmanager.yml
│   ├── promtail-config.yml
│   └── docker-compose-monitoring.yml
├── security/               # DevSecOps
│   ├── trivy-scan.sh
│   ├── sonarqube-properties
│   └── rbac.yaml
├── jenkins/
│   └── Jenkinsfile
├── .github/workflows/
│   └── ci-cd.yml
├── docs/
│   ├── branching-strategy.md
│   └── setup-guide.md
├── docker-compose.yml
└── README.md
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/your-username/student-management-devops.git

# 2. Run locally with Docker Compose
docker compose up -d

# 3. Open browser
# App:      http://localhost
# API:      http://localhost:5000/api/students
# Health:   http://localhost:5000/health
```

See [docs/setup-guide.md](docs/setup-guide.md) for full setup instructions.

---

## Technologies

| Category          | Tool                      |
| ----------------- | ------------------------- |
| Version Control   | Git, GitHub               |
| CI/CD             | GitHub Actions, Jenkins   |
| Containerization  | Docker                    |
| Orchestration     | Kubernetes (Minikube/EKS) |
| IaC               | Terraform                 |
| Config Management | Ansible                   |
| Monitoring        | Prometheus, Grafana       |
| Logging           | Loki, Promtail            |
| Security          | Trivy, SonarQube, RBAC    |
| Cloud             | AWS EC2, EKS              |

---

## Evaluation Criteria

| Criteria                     | Weight |
| ---------------------------- | ------ |
| CI/CD Automation             | 20%    |
| Docker & Kubernetes          | 20%    |
| Infrastructure Automation    | 15%    |
| Monitoring & Logging         | 15%    |
| Security Integration         | 20%    |
| Documentation & Presentation | 10%    |
