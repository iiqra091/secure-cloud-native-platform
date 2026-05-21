#!/bin/bash
# ═══════════════════════════════════════════════════
# DevOps Setup Script — EC2 Ubuntu 22.04
# Covers: Module 4 (K8s), Module 6 (Ansible/Config)
# ═══════════════════════════════════════════════════

set -e
echo "════════════════════════════════════"
echo " DevOps Server Setup Starting..."
echo "════════════════════════════════════"

# ── Step 1: System Update ─────────────────────────
echo "[1/7] Updating system..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y curl wget git unzip apt-transport-https ca-certificates gnupg lsb-release

# ── Step 2: Install Docker ────────────────────────
echo "[2/7] Installing Docker..."
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker
echo "✅ Docker installed: $(docker --version)"

# ── Step 3: Install kubectl ───────────────────────
echo "[3/7] Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl
echo "✅ kubectl installed: $(kubectl version --client --short 2>/dev/null)"

# ── Step 4: Install K3s (Lightweight Kubernetes) ──
echo "[4/7] Installing K3s (Kubernetes)..."
curl -sfL https://get.k3s.io | sh -
sudo systemctl enable k3s
sudo systemctl start k3s

# Setup kubeconfig for ubuntu user
mkdir -p /home/ubuntu/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
sudo chown ubuntu:ubuntu /home/ubuntu/.kube/config
sudo chmod 600 /home/ubuntu/.kube/config
echo 'export KUBECONFIG=/home/ubuntu/.kube/config' >> /home/ubuntu/.bashrc
export KUBECONFIG=/home/ubuntu/.kube/config
echo "✅ K3s installed"

# ── Step 5: Install Ansible ───────────────────────
echo "[5/7] Installing Ansible..."
sudo apt-get install -y ansible
echo "✅ Ansible installed: $(ansible --version | head -1)"

# ── Step 6: Install Helm ──────────────────────────
echo "[6/7] Installing Helm..."
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
echo "✅ Helm installed: $(helm version --short)"

# ── Step 7: Install Trivy (Security Scanner) ──────
echo "[7/7] Installing Trivy..."
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo gpg --dearmor -o /usr/share/keyrings/trivy.gpg
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt-get update -y
sudo apt-get install -y trivy
echo "✅ Trivy installed: $(trivy --version)"

# ── Done ──────────────────────────────────────────
echo ""
echo "════════════════════════════════════"
echo " ✅ ALL TOOLS INSTALLED!"
echo "════════════════════════════════════"
echo " Docker:  $(docker --version)"
echo " kubectl: $(kubectl version --client --short 2>/dev/null)"
echo " Ansible: $(ansible --version | head -1)"
echo " Helm:    $(helm version --short)"
echo " Trivy:   $(trivy --version)"
echo "════════════════════════════════════"
echo " Run: source ~/.bashrc"
echo " Then: kubectl get nodes"
echo "════════════════════════════════════"
