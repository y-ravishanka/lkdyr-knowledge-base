---
sidebar_position: 1
description: Install Node.js, PM2, and the .NET SDK, then deploy Node.js, Vite/React, and .NET apps with PM2.
---

# Setup Deployment Environment

This document is a guide on how to set up a Linux environment for deploying applications, covering the installation of `Node.js`, `PM2`, and the `.NET SDK`, along with how to deploy Node.js, Vite/React, and .NET applications using PM2.

## 1. Install Node.js

Download and run the NodeSource setup script for the current LTS version:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
```

Install Node.js (`npm` comes bundled):

```bash
sudo apt install nodejs
```

Verify the installation:

```bash
node -v
npm -v
```

Update `npm` to the latest version:

```bash
sudo npm install -g npm@latest
```

## 2. Install PM2

Install PM2 globally:

```bash
sudo npm install -g pm2
```

Verify the installation:

```bash
pm2 -v
```

Configure PM2 to auto-restart applications when the server restarts:

```bash
pm2 startup
```

## 3. Install .NET SDK

Install the .NET SDK:

```bash
sudo apt install dotnet-sdk-10.0
```

*Change the version accordingly, e.g. `dotnet-sdk-<x>.0`.*

## 4. Deploying Applications with PM2

Move the terminal to the application folder before running any of the commands below.

### 4.1 Deploy a Node.js Server

```bash
pm2 start <server.js> --name <application name>
```

If the application is started via an npm script:

```bash
pm2 start npm --name <application name> -- start
```

### 4.2 Deploy a Vite/React Application

A Vite/React build produces static files rather than a deployable binary, so a static file server is needed in front of PM2.

Install `serve`:

```bash
sudo npm install -g serve
```

Deploy using PM2:

```bash
pm2 serve <build result folder> <port> --name <application name> --spa
```

Alternatively, use Nginx to serve the build files directly:

```nginx
server {
    listen 80;
    server_name app.example.com;

    root <build result folder>;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

*See the [Deployment](./Deployment.md) document for Nginx install and setup instructions.*

### 4.3 Deploy a .NET Application

```bash
pm2 start "dotnet <dll file name> --urls http://127.0.0.1:<port>" --name <application name>
```

Or:

```bash
pm2 start <dll file name> --name <application name> --interpreter dotnet
```

**!!! Important**
> See the [Firewall Setup](./firewall-setup.md) document for firewall-related configuration needed to expose deployed applications.

> See the [Deployment](./Deployment.md) document for nginx related configuration needed to expose deployed applications.
