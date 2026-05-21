#!/bin/bash
# Module 8: DevSecOps — Trivy Security Scanning Script
# Scans filesystem, Docker images, and Kubernetes configs

set -e

IMAGE_NAME=${1:-"student-backend:latest"}
REPORT_DIR="./security/reports"
mkdir -p "$REPORT_DIR"

echo "============================================"
echo " DevSecOps Security Scan — Trivy"
echo "============================================"

# 1. Filesystem scan (source code vulnerabilities)
echo ""
echo "[1/3] Scanning filesystem for vulnerabilities..."
trivy fs . \
  --severity HIGH,CRITICAL \
  --format table \
  --output "$REPORT_DIR/fs-scan-report.txt"
echo "Filesystem scan complete. Report: $REPORT_DIR/fs-scan-report.txt"

# 2. Docker image scan
echo ""
echo "[2/3] Scanning Docker image: $IMAGE_NAME ..."
trivy image \
  --severity HIGH,CRITICAL \
  --format json \
  --output "$REPORT_DIR/image-scan-report.json" \
  "$IMAGE_NAME"
echo "Image scan complete. Report: $REPORT_DIR/image-scan-report.json"

# 3. Kubernetes config scan
echo ""
echo "[3/3] Scanning Kubernetes manifests..."
trivy config \
  --severity HIGH,CRITICAL \
  --format table \
  --output "$REPORT_DIR/k8s-config-report.txt" \
  ./kubernetes/
echo "K8s config scan complete. Report: $REPORT_DIR/k8s-config-report.txt"

echo ""
echo "============================================"
echo " All scans complete. Reports saved to: $REPORT_DIR"
echo "============================================"
