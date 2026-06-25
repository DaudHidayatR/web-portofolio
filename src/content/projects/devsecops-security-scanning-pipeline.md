---
title: DevSecOps Security Scanning Pipeline
description: >-
  A public Secure SDLC and DevSecOps boilerplate for running repeatable security
  checks with SAST, secret scanning, dependency scanning, container scanning,
  SBOM generation, and IaC policy validation.
image: '@assets/projects/devsecops-security-scanning-pipeline/DevSecOps-pipeline.webp'
imageAlt: >-
  DevSecOps CI/CD security scanning pipeline architecture using GitHub,
  Trivy, Semgrep, GitLeaks, Syft SBOM, Kyverno, Conftest, Cosign, Sigstore,
  SLSA provenance, DAST, and Kubernetes staging deployment.
imageDisplay: diagram
startDate: 2026-05-01
skills:
  - CI/CD Security
  - Secure SDLC
  - SAST
  - Secret Scanning
  - SBOM
  - Trivy
  - Semgrep
  - Shell
featured: true
category: real-projects
sourceLink: https://github.com/DaudHidayatR/scan-apps-pipeline
---
## Overview

This project is a public **Secure SDLC / DevSecOps boilerplate** for running repeatable security checks against application code, container images, and Kubernetes or infrastructure-as-code assets. It is built around a simple idea: security validation should be easy to run locally, easy to automate in CI/CD, and easy for developers to understand.

The implementation intentionally stays lightweight. A Bash orchestrator runs containerized security tools directly, with scanner versions and thresholds controlled through `config.env`. This keeps the pipeline portable across repositories without requiring a custom platform or compiled service.

## Problem

Manual security review does not scale well when backend code, container images, and deployment manifests change frequently. Without automation, teams can miss leaked secrets, vulnerable dependencies, insecure container images, or risky Kubernetes configuration until late in the release process.

This project explores how those checks can shift earlier into the development workflow while still producing useful artifacts for follow-up review.

## What I Built

The main local entrypoint is `scripts/security-scan.sh`, supported by Makefile targets for common workflows. The script detects a container runtime, prefers Podman when available, falls back to Docker, and runs scanners in containers against the repository.

The pipeline covers several validation areas:

| Area | Tools | Purpose |
|---|---|---|
| SAST | Semgrep | Detect insecure code and configuration patterns using OWASP, CWE, supply-chain, Docker, Kubernetes, and language-specific rules. |
| Secret detection | GitLeaks | Detect leaked credentials in the working tree and Git history. |
| Vulnerability and misconfiguration scanning | Trivy, Grype | Scan filesystems, dependencies, container images, secrets, licenses, and rendered manifests. |
| SBOM generation | Syft | Generate software bills of materials in SPDX and CycloneDX formats. |
| IaC and policy validation | Checkov, Kyverno, Conftest | Validate infrastructure, Kubernetes manifests, and policy rules. |

## Local Workflow

The full local suite can be started with:

```bash
make security
```

Individual scan groups can also run separately:

```bash
make sast
make secrets
make sca
make sbom
make iac
make validate
```

The goal is to make the same security checks usable before a commit, during CI, or while experimenting with a local lab repository.

## CI/CD Workflow

The repository includes two GitHub Actions workflows:

- `apps.yml` for application security checks.
- `IaC.yml` for infrastructure and Kubernetes configuration checks.

The workflows run linting, secret detection, SAST, SCA, SBOM generation, manifest scanning, policy validation, and report upload. SARIF reports are uploaded to GitHub code scanning when possible, and generated reports are stored as CI artifacts for review.

The current fail policy is intentionally developer-friendly: scanner findings do not automatically fail the build, but missing or empty reports do. This keeps the pipeline focused on collecting evidence first, then leaves room to add stricter quality gates later.

## Output Artifacts

The pipeline generates machine-readable and human-readable outputs, including:

- `trivy-report.json`
- `trivy-report.sarif`
- `trivy-report.txt`
- `trivy-rendered.sarif`
- `grype-report.json`
- `gitleaks-report.json`
- `semgrep-report.json`
- `semgrep-report.sarif`
- `semgrep-report.txt`
- `sbom-spdx.json`
- `sbom-cyclonedx.json`

These outputs support different review needs: SARIF for GitHub Security integration, JSON for automation, text/table output for quick local reading, and SBOM files for software inventory.

## What It Shows

This project demonstrates how I approach Secure SDLC enablement: start with repeatable checks, make them visible in CI/CD, and produce artifacts that developers can act on. It also shows practical DevSecOps tradeoffs, such as version-pinned scanner containers, rootless-friendly runtime support, artifact validation, and a fail-on-crash-first policy.

## Current Status

This project is public, but still under active development. Some parts are intentionally prepared as a foundation rather than a final production pipeline. For example, the image build and image-scanning flow still needs more improvement so it can be used reliably across different application repositories.

The next step is to make the pipeline easier to reuse as a polished public template, with clearer examples, safer default targets, and better documentation around quality gates.

## Next Improvements

- Add clearer demo targets and sample reports.
- Improve the container image build and image scanning workflow.
- Add configurable severity gates for teams that want findings to block releases.
- Add a summary report that groups findings by tool, severity, and remediation priority.
- Improve documentation for adapting the pipeline to GitHub Actions, GitLab CI, and local development.
