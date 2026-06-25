---
featured: true
category: real-projects
title: Self-Hosted DevSecOps Lab
description: >-
  A rootless Kubernetes DevSecOps lab that combines GitOps, service mesh,
  secrets management, network policy, and the DevSecOps Security Scanning
  Pipeline as part of a controlled Secure SDLC practice environment.
image: '@assets/projects/self-hosted-devsecops-lab/Homelab-DevSecOps.webp'
imageAlt: >-
  Self-hosted DevSecOps homelab architecture with rootless kind Kubernetes,
  GitHub CI/CD, Flux GitOps, secret management, sandbox testing,
  vulnerability management, and integrated security scanning.
imageDisplay: cover
startDate: 2026-05-01
skills:
  - Kubernetes
  - kind
  - Istio
  - OpenBao
  - Flux CD
  - Tailscale
  - DevSecOps
  - Security Scanning
sourceLink: https://github.com/DaudHidayatR/homelab-devsecops
---
## Overview

This project is a self-hosted DevSecOps lab for practicing secure infrastructure and delivery workflows without exposing real production systems. It uses a local `kind` Kubernetes cluster as the base environment, then layers GitOps, service mesh, secrets management, network policies, and security scanning on top.

The lab also uses the [DevSecOps Security Scanning Pipeline](/projects/devsecops-security-scanning-pipeline/) as part of its validation workflow. Instead of treating scanning as a separate demo, the pipeline is connected to the homelab as the security-check layer for manifests, repository configuration, and delivery artifacts.

The lab exists because DevSecOps skills need a place to be tested safely. Instead of only reading about Kubernetes security, service mesh, or secret management, this repository gives me a controlled environment where I can deploy, break, observe, and improve those patterns.

## Problem

Security-aware delivery workflows are hard to learn from theory alone. Topics like GitOps reconciliation, mTLS, Kubernetes network policy, secret bootstrapping, and deployment rollback need hands-on practice. At the same time, experimenting directly on production infrastructure is risky.

This project solves that learning gap by providing a reproducible lab where infrastructure and application components can be deployed, scanned, and reviewed in a safer environment.

## What I Built

The repository is organized around modular Kubernetes and GitOps components:

| Area | Implementation |
|---|---|
| Cluster base | Rootless `kind` cluster configuration. |
| GitOps | Flux CD entrypoints under `clusters/kind/`. |
| Infrastructure layer | Namespaces, Istio, OpenBao, External Secrets, and policy-related resources. |
| Application layer | Demo app, RabbitMQ, and Headlamp managed under `apps/`. |
| Access layer | Tailscale operator and scripts for private access workflows. |
| Security scanning layer | DevSecOps Security Scanning Pipeline integration for SAST, secret scanning, dependency checks, SBOM generation, and IaC or Kubernetes policy validation. |
| Operations | Makefile and scripts for setup, teardown, validation, reconciliation, and status checks. |

The lab supports two setup paths. When Flux and GitHub credentials are available, Flux bootstraps and reconciles the cluster from Git. When Flux is unavailable, setup scripts fall back to direct `kubectl apply -k` deployment so the lab can still be used locally.

## Security & Engineering Focus

The lab focuses on security controls that commonly appear in Secure SDLC and platform engineering conversations:

- Istio service mesh components for service-to-service security practice.
- OpenBao for secret management and policy learning.
- External Secrets integration patterns.
- Default-deny network policies for application and infrastructure namespaces.
- Tailscale-based private access workflows.
- Flux-based GitOps reconciliation and semver-tag deployment behavior.
- DevSecOps Security Scanning Pipeline usage for validating manifests, repository configuration, dependencies, secrets, SBOMs, and policy rules.

This makes the project useful as a bridge between backend delivery and infrastructure security.

## Related Project

- [DevSecOps Security Scanning Pipeline](/projects/devsecops-security-scanning-pipeline/) - used as the lab's security validation layer for SAST, secret scanning, dependency checks, SBOM generation, and IaC or Kubernetes policy review.

## Operational Workflow

Common workflows are exposed through Makefile targets:

```bash
make up
make down
make scan
make status
make validate-kustomize
make sync
make flux-status
make flux-diff
```

The setup script prints a final summary showing whether Flux GitOps or direct apply fallback was used, whether Tailscale was enabled, and which OpenBao or External Secrets steps still need manual follow-up.

## What It Shows

This project demonstrates that I can reason beyond application code and think about the platform conditions needed for safer delivery. It shows experience with Kubernetes structure, GitOps workflows, secrets management, network isolation, and operational scripts.

It also supports future blog posts and project deep-dives because each component can become a focused technical explanation: OpenBao bootstrapping, Flux semver deployment, network policies, or Tailscale access design.

## Current Status

This is a public learning lab, not production infrastructure. It is intentionally designed for experimentation and documentation. Some steps still require manual operation, especially around OpenBao initialization, secret seeding, and environment-specific access configuration.

## Next Improvements

- Add clearer architecture diagrams for the lab.
- Document the OpenBao bootstrap flow in more detail.
- Add example screenshots or terminal outputs for successful setup.
- Improve the security scan report story and connect it with the scanning pipeline project.
- Create blog posts from specific lab components, starting with Kubernetes, Istio, and OpenBao.
