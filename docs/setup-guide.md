# Setup Guide — Student Management DevOps Platform

## Prerequisites

- Docker & Docker Compose installed
- kubectl installed
- Minikube or access to a Kubernetes cluster
- AWS CLI configured (for Terraform)
- Ansible installed (for configuration management)

---

## 1. Local Development (Docker Compose)

```bash
# Clone the repository
git clone https://github.com/your-username/student-management-devops.git
cd student-management-devops

# Start all services
docker compose up -d

# Access the app
# Frontend: http://localhost:80
# Backend API: http://localhost:5000
# Health check: http://localhost:5000/health
```

---

## 2. Infrastructure Provisioning (Terraform)

```bash
cd terraform

# Initialize Terraform
terraform init

# Preview changes
terraform plan -var="key_pair_name=your-key" -var="vpc_id=vpc-xxx" -var="subnet_id=subnet-xxx"

# Apply infrastructure
terraform apply -var="key_pair_name=your-key" -var="vpc_id=vpc-xxx" -var="subnet_id=subnet-xxx"

# Destroy when done
terraform destroy
```

---

## 3. Server Configuration (Ansible)

```bash
cd ansible

# Update inventory.ini with your server IPs

# Install Docker on servers
ansible-playbook -i inventory.ini install-docker.yml

# Install Kubernetes tools
ansible-playbook -i inventory.ini install-kubernetes.yml

# Configure Jenkins
ansible-playbook -i inventory.ini configure-jenkins.yml
```

---

## 4. Kubernetes Deployment

```bash
# Start Minikube (local)
minikube start

# Apply all manifests
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/ingress.yaml

# Check status
kubectl get pods -n student-app
kubectl get services -n student-app

# Access via Minikube
minikube service frontend-service -n student-app
```

---

## 5. Monitoring Stack

```bash
cd monitoring

# Start Prometheus + Grafana + Loki
docker compose -f docker-compose-monitoring.yml up -d

# Access dashboards
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3001  (admin / admin123)
# Alertmanager: http://localhost:9093
```

---

## 6. Security Scanning

```bash
# Run all security scans
chmod +x security/trivy-scan.sh
./security/trivy-scan.sh student-backend:latest

# Apply RBAC policies
kubectl apply -f security/rbac.yaml
```

---

## GitHub Actions Secrets Required

| Secret                | Description                    |
| --------------------- | ------------------------------ |
| `DOCKER_HUB_USERNAME` | Your Docker Hub username       |
| `DOCKER_HUB_TOKEN`    | Docker Hub access token        |
| `SONAR_TOKEN`         | SonarQube authentication token |
| `SONAR_HOST_URL`      | SonarQube server URL           |
| `KUBECONFIG`          | Base64-encoded kubeconfig file |
