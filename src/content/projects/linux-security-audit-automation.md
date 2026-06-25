---
title: Linux Security Audit Automation
description: >-
  A Linux security reporting project that turns periodic host checks into
  repeatable text and HTML reports with optional email delivery.
image: '@assets/projects/linux-security-audit-automation/linux-security-audit-automation.webp'
imageAlt: >-
  Linux security audit automation dashboard for virtual machine hardening,
  Lynis checks, Fail2ban status, auditd review, package integrity, account
  hygiene, and automated host security reporting.
imageWidth: 750
imageHeight: 380
imageDisplay: diagram
startDate: 2026-05-01
skills:
  - Linux
  - Shell
  - Lynis
  - Fail2ban
  - Auditd
  - Security Reporting
  - Automation
featured: true
category: experiments
sourceLink: https://github.com/DaudHidayatR/security-audit-report
---
## Overview

This project automates a weekly Linux security report for a host or VPS. The goal is not to replace a full security platform, but to make routine operational checks easier to repeat, review, and send to the right person.

The main entrypoint is `weekly-security-report.sh`. It gathers security-related information from common Linux tools and system files, then writes both plain-text and HTML reports.

## Problem

Manual server reviews are easy to skip because they are repetitive. A basic host review may require checking audit logs, account expiry, Fail2ban status, package integrity tooling, and Lynis output. If those checks are not automated, they depend too much on memory and manual discipline.

This project turns that habit into a repeatable report that can run weekly and preserve a consistent output format.

## What I Built

The script creates a report directory at `/var/log/security-weekly-report`, collects available system data, and generates two latest report files:

```text
/var/log/security-weekly-report/latest-report.txt
/var/log/security-weekly-report/latest-report.html
```

It can also send the generated report by email through `msmtp` or another sendmail-compatible mailer.

## Checks Covered

The report includes several operational security checks when the relevant tools are available:

| Area | Source / Tool | Purpose |
|---|---|---|
| System audit | Lynis | Run or summarize host hardening audit information. |
| Blocking and brute-force protection | Fail2ban | Summarize service status and jail information. |
| Audit logging | auditd / auditctl / audit log | Summarize audit rule and log information. |
| Account hygiene | `/etc/shadow` | Check password expiry for selected accounts. |
| Package integrity | debsums | Report package verification status on Debian or Ubuntu systems. |
| Email delivery | msmtp / sendmail-compatible mailer | Send reports to a configured recipient. |

If a tool is missing, the script still runs and marks that section as `unknown`, `missing`, or `none` instead of failing immediately.

## Configuration Model

The script loads configuration from multiple sources so it can be used locally, manually, or as an installed system job:

1. `/etc/default/weekly-security-report`
2. `.env` in the repository directory
3. existing environment variables

A `.env.example` file is included for local configuration. SMTP-related values can be provided through `.env`, or a system-wide `msmtprc` file can be installed from the included template.

## Cron Workflow

The repository includes `weekly-security-report.cron`, which expects the main script to be installed at:

```text
/usr/local/sbin/weekly-security-report.sh
```

The intended production-style installation is:

```bash
sudo install -m 755 ./weekly-security-report.sh /usr/local/sbin/weekly-security-report.sh
sudo install -m 755 ./weekly-security-report.cron /etc/cron.weekly/weekly-security-report
```

## What It Shows

This project demonstrates the operational side of DevSecOps: not every security improvement needs to be a complex platform. Sometimes the useful work is turning manual host checks into a repeatable report, documenting assumptions, and making the result easy to review.

It also shows practical Linux administration concerns such as root-only files, mailer configuration, safe `.env` handling, cron installation, and graceful behavior when optional tools are missing.

## Current Status

This project is public and usable as a small Linux security reporting utility. It should be run carefully because it reads privileged files and writes under `/var/log`. Real SMTP credentials, recipient addresses, and host-specific details should stay in local configuration files and should never be committed.

## Next Improvements

- Add sanitized sample text and HTML reports.
- Add screenshots of the generated report format.
- Add more explicit checks for firewall status and service exposure.
- Add a summary severity model so important findings are easier to prioritize.
- Document a safer test workflow for users who want to try the script in a disposable VM.
