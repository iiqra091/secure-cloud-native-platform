# Module 1: VCS Branching Strategy

## Branch Structure

```
main              ← Production-ready code only
dev               ← Integration branch (merge features here first)
feature/security  ← DevSecOps security features
feature/*         ← Any new feature branches
hotfix/*          ← Emergency production fixes
```

## Workflow

1. Developer creates a `feature/your-feature` branch from `dev`
2. Code is written and committed locally
3. Pull Request (PR) opened: `feature/your-feature` → `dev`
4. CI pipeline runs automatically on PR (tests + security scan)
5. Code review by team member
6. Merge to `dev` after approval
7. When `dev` is stable → PR to `main`
8. Merge to `main` triggers full CI/CD pipeline → production deploy

## Commands

```bash
# Clone repo
git clone https://github.com/your-username/student-management-devops.git
cd student-management-devops

# Create and switch to dev branch
git checkout -b dev
git push -u origin dev

# Create feature branch
git checkout -b feature/security
git push -u origin feature/security

# After changes, commit and push
git add .
git commit -m "feat: add security scanning to pipeline"
git push origin feature/security

# Open Pull Request on GitHub UI: feature/security → dev
```

## Commit Message Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
ci:       CI/CD pipeline changes
security: Security-related changes
chore:    Maintenance tasks
```
