---
title: "Building a DevSecOps Security Scanning Pipeline for Secure SDLC"
description: "How I structure a public DevSecOps scanning pipeline with SAST, secret detection, dependency scanning, SBOM generation, IaC checks, SARIF reports, and developer-friendly security evidence."
image: "@assets/placeholders/blog-devsecops.svg"
publishDate: "2026-06-18"
tags: ["DevSecOps", "Secure SDLC", "CI/CD Security", "SAST", "SBOM"]
---

# Building a DevSecOps Security Scanning Pipeline for Secure SDLC

Security checks are most useful when developers can run them early, understand the output, and repeat the same workflow in CI/CD. That is the reason I built a public DevSecOps security scanning pipeline: not as a finished security platform, but as a practical Secure SDLC boilerplate that collects evidence from common scanners.

The project behind this article is [`scan-apps-pipeline`](https://github.com/DaudHidayatR/scan-apps-pipeline). It is still under active development, but the current version already shows the workflow I want to practice: local scans, CI scans, report artifacts, SARIF output, and a path toward stronger release gates later.

## Why I Built This

Manual security review is easy to skip when changes move quickly. A backend service can introduce a vulnerable dependency, a leaked token, an insecure Dockerfile pattern, or a risky Kubernetes manifest long before anyone reviews the deployment manually.

My goal was to create a pipeline that answers a few practical questions before deployment:

- Did the code introduce obvious insecure patterns?
- Did the repository leak secrets?
- Are there high or critical dependency or container vulnerabilities?
- Can the pipeline generate SBOM artifacts for inventory?
- Are Kubernetes or infrastructure manifests failing basic policy checks?
- Can the findings be collected without making the workflow too hard to adopt?

## What I Wanted From the Pipeline

I did not want a complex custom platform. For this stage, the pipeline should be simple enough to understand and portable enough to reuse.

The design goals are:

- Use existing CLI scanners instead of writing a scanner from scratch.
- Pin scanner container images so runs are more reproducible.
- Support local execution with Docker or Podman.
- Generate reports in formats that humans and CI systems can consume.
- Upload SARIF where possible so findings can appear in GitHub code scanning.
- Treat missing reports as failures, but avoid blocking every build on findings while the project is still maturing.

That last point matters. In many teams, a security pipeline fails culturally before it fails technically: if it blocks too much too early, developers ignore it or try to bypass it. I prefer collecting evidence first, then adding stricter gates once the false-positive and severity strategy is clear.

## Pipeline Architecture

The local entrypoint is a Bash script: `scripts/security-scan.sh`.

The script loads scanner versions and thresholds from `config.env`, detects the available container runtime, and runs scanner containers against the repository.

The high-level workflow looks like this:

```text
Developer / CI Runner
        |
        v
scripts/security-scan.sh
        |
        +--> Trivy     -> vulnerability, secret, misconfig, license reports
        +--> Grype     -> dependency and package vulnerability report
        +--> GitLeaks  -> secret detection report
        +--> Semgrep   -> SAST JSON, SARIF, and text reports
        +--> Syft      -> SPDX and CycloneDX SBOM files
        +--> Kustomize -> rendered manifest scan when manifests exist
        |
        v
JSON / SARIF / TXT / SBOM artifacts
```

The repository also includes GitHub Actions workflows for application scanning and infrastructure-as-code scanning:

- `.github/workflows/apps.yml`
- `.github/workflows/IaC.yml`

## Scanner Groups

The scanner suite is grouped by the kind of risk it checks.

| Area | Tools | Purpose |
|---|---|---|
| SAST | Semgrep | Detect insecure code and configuration patterns. |
| Secret detection | GitLeaks | Find leaked credentials in history and working tree. |
| Vulnerability scanning | Trivy, Grype | Identify known dependency, package, and image risks. |
| SBOM generation | Syft | Produce SPDX and CycloneDX software inventories. |
| IaC / policy checks | Checkov, Kyverno, Conftest | Validate infrastructure and Kubernetes configuration. |

Semgrep uses general and security-focused rulesets such as OWASP Top 10, CWE Top 25, supply-chain, Docker, Kubernetes, and detected language rules. Trivy is used for filesystem, configuration, secret, license, and rendered manifest scanning. Syft produces SBOM outputs so the project can document what software components exist.

## Output Artifacts

One of the most important parts of this project is not the scan command itself, but the artifacts it produces.

The pipeline can generate outputs such as:

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

Different formats serve different audiences. SARIF works well for GitHub code scanning. JSON works well for automation. Text output is useful for quick local inspection. SBOM files help document dependency inventory.

## Why Findings Do Not Fail the Build Yet

The current policy is intentionally conservative: scanner findings do not automatically fail the build, but missing or empty reports do.

This is not the final state. It is a development-stage decision.

The reason is simple: before making security findings block a release, I want the pipeline to consistently generate reports, produce useful output, and avoid noisy defaults. Once the signal quality is better, the next step is to add configurable gates by severity, scanner type, or deployment stage.

A more mature version could use rules like:

- fail on critical secrets
- warn on low or medium dependency findings
- fail on high or critical exploitable CVEs
- block deployment on unsafe Kubernetes policy violations
- create issues instead of blocking when risk is accepted

## What Still Needs Improvement

The project is public, but it is still evolving. The biggest improvement area is the container image build and image-scanning flow. The pipeline already documents the direction, but I want the workflow to be easier to reuse across different application repositories before I treat it as complete.

Other improvements I want to add:

- clearer demo targets
- sanitized sample reports
- a summary report grouped by severity and tool
- configurable quality gates
- better GitHub Actions examples
- clearer guidance for adapting the pipeline to GitLab CI or other systems

## What I Learned

This project helped me think about DevSecOps as a developer enablement problem, not only a tooling problem. A good security pipeline should make risk visible without making every developer become a security specialist.

The main lesson is that Secure SDLC automation should start with repeatability and evidence. Once the checks are reliable and understandable, stricter enforcement becomes easier to justify.

That is the direction I want this pipeline to grow toward: simple local usage, useful CI/CD reports, and security gates that are strict enough to matter without becoming noise.
