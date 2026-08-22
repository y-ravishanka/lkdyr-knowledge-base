---
sidebar_position: 6
description: Set up and configure UFW to control inbound and outbound traffic on a Linux server.
---

# Setup and Configure Firewall (UFW)

This document is a guide on how to set up and configure `UFW` (Uncomplicated Firewall) on a Linux environment to control inbound and outbound traffic.

## 1. Install UFW

Install UFW using the package manager:

```bash
sudo apt install ufw
```

## 2. Allow SSH Access

Before enabling UFW, allow SSH access, otherwise you will be locked out of the server:

```bash
sudo ufw allow OpenSSH
```

Or explicitly allow the port, especially if SSH runs on a non-default port:

```bash
sudo ufw allow 22/tcp
```

## 3. Allow Web Traffic

Allow standard HTTP and HTTPS traffic:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## 4. Enable the Firewall

Enable UFW:

```bash
sudo ufw enable
```

Check the status of the firewall and its rules:

```bash
sudo ufw status
```

## 5. Applying New Rules

After UFW is enabled, reload it whenever a new rule is added for the change to take effect:

```bash
sudo ufw reload
```

**!!! Important**
> Any service that needs to accept remote connections (e.g. MS SQL Server, Redis) requires its own UFW rule. See the relevant setup documentation (e.g. [MS SQL Server](./ms-sql-server-for-ubuntu22.md), [Redis](./install-redis.md)) for the ports to allow.
